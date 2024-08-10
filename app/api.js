const express = require('express');
const { PublicKey } = require('@solana/web3.js');
const router = express.Router();
const knex = require('./database/knex');
const config = require('./config');
const { GetRefString, GetRandomNumber } = require('./tools');
const { GetUserData, GetFraudData, GetFraudCount } = require('./database/users');
const referrals = require('./database/referrals');
const leaderboard = require('./database/leaderboard');
const { LogRequest} = require("./middleware");
const rateLimit = require('express-rate-limit');
const users = require("./database/users");

// Create a rate limiter middleware (1 request per second)
const addRequestLimiter = rateLimit({
    windowMs: 1000, // miliseconds
    max: 2, // Limit each IP to 1 request per windowMs
    message: 'Too many requests, please try again later.'
});

// API route to handle POST /api/add_score
router.post('/add_score', addRequestLimiter, LogRequest, async (req, res) => {
    const { username, score } = req.body;

    if (!score || score < 0) {
        return res.status(400).send('Invalid score');
    }

    if (score > GetRandomNumber(config.SCORE_FRAUD_LIMIT_LOW, config.SCORE_FRAUD_LIMIT_HIGH)) {
        return res.status(400).send('Looks like you are trying to cheat');
    }

    try {
        // Check if the user exists in the users table
        const user = await knex('users').where({username}).first();

        if (!user) {
            return res.status(404).send('User not found');
        }

        await leaderboard.AddScore(user.id, score, user.referred_by);

        res.status(200).send('Score updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to handle GET /api/profile
router.get('/profile', async (req, res) => {
    const { username, ref_string } = req.query;

    try {
        // Check if the user exists in the users table
        let user = await GetUserData(username);

        if (!user) {
            let referred_by = null;

            if (ref_string) {
                // Search for the referrer user in the users table
                const ref_user = await knex('users')
                    .whereRaw(`HEX(CRC32(CONCAT(username, id))) = '${ref_string}'`).first();
                referred_by = ref_user.id;
            }

            const [userID] = await knex('users').insert({ username, referred_by });
            await knex('leaderboard').insert({ user_id: userID, score: 0 });

            user = await GetUserData(username);

            // Increment the referrer's score in the leaderboard
            if (referred_by) {
                // Insert the referral data into the referrals table
                await referrals.CreateReferral(userID, referred_by, config.SCORE_REFERRAL_BONUS);
                const referral_user = users.GetUserData(referred_by);

                // Increment the referrer's score in the leaderboard + its referrer and so on
                await leaderboard.AddScore(referred_by, config.SCORE_REFERRAL_BONUS, referral_user.referred_by);
            }
        }

        const { wallet } = user;
        const wallet_short = wallet.substring(0, 20);

        const { score } = await knex('leaderboard')
            .where({ user_id: user.id })
            .select('score')
            .first();

        const fraud_count = await GetFraudCount(user.id);

        const referral_code = GetRefString(username, user.id);
        const referral_link = `https://${process.env.TELEGRAM_APP_URL}?startapp=${referral_code}`;

        res.status(200).json({ username, score, fraud_count, referral_link, wallet_short });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// API route to handle GET /api/leaderboard
router.get('/leaderboard', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // Get the top positions from the leaderboard table sorted by score in descending order
        const leaderboard = await knex('leaderboard')
            .join('users', 'leaderboard.user_id', 'users.id')
            .select('users.username', 'leaderboard.score')
            .orderBy('leaderboard.score', 'desc')
            .limit(limit)
            .offset(offset);

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to handle GET /api/referred
router.get('/referred', async (req, res) => {
    const { username } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // Check if the user exists in the users table
        const user = await knex('users').where({username}).first();

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Get the top positions from the referrals table sorted by bonus in descending order
        const referrals = await knex('referrals')
            .join('users', 'referrals.user_id', 'users.id')
            .select('users.username', 'referrals.bonus as score')
            .orderBy('referrals.bonus', 'desc')
            .where('referrals.referred_by', user.id)
            .limit(limit)
            .offset(offset);

        res.status(200).json(referrals);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to handle POST /api/wallet
router.post('/wallet', async (req, res) => {
    const { username, wallet } = req.body;

    try {
        // Validate Solana wallet address
        if (!PublicKey.isOnCurve(wallet)) {
            return res.status(400).send('Invalid Solana address!');
        }
        const existing_wallet = await knex('users').where({wallet}).select('id').first();
        const user = await knex('users').where({username}).first();

        if (existing_wallet && user.id !== existing_wallet.id) {
            return res.status(409).send('Wallet address already exists');
        }
        if (user) {
            // Update the user's wallet address in the users table
            await knex('users')
                .where({ id: user.id })
                .update({ wallet });
        } else {
            res.status(404).send('User not found');
        }

        res.status(200).send('Wallet updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// API route to handle GET /api/cheater receives info about possible cheater and logs it to the console
router.post('/fraud', async (req, res) => {
    const { user_data, username } = req.body;

    if (!user_data) {
        return res.status(400).send('User data is required');
    }

    console.log(`Possible cheater detected: ${JSON.stringify(user_data)}`, `IP: ${req.ip}`, `User-Agent: ${req.headers['user-agent']}`);

    if (!username) {
        return res.status(400).send('Username is required');
    }

    // check if this user exists
    const user = await knex('users').where({username}).first();

    if (!user) {
        return res.status(404).send('User not found');
    }

    const fraud_data = await GetFraudData(user.id);

    if (fraud_data) {
        // increment count
        await knex('fraud_reports')
            .where({ id: fraud_data.id })
            .increment('count', 1);
        return res.status(200).send('Cheater reported');
    } else {
        // insert data to fraud_reports table
        await knex('fraud_reports').insert({
            user_id: user.id,
            user_data,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });
    }

    res.status(200).send('Cheater reported');
});

module.exports = router;