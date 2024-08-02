const express = require('express');
const { PublicKey } = require('@solana/web3.js');
const router = express.Router();
const knex = require('./database');
const { GetRefString } = require('./tools');

// API route to handle POST /api/click
router.post('/click', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if the user exists in the users table
        const user = await knex('users').where({username}).first();

        if (user) {
            // Increment the user's score in the leaderboard table by 1
            await knex('leaderboard')
                .where({ user_id: user.id })
                .increment('score', 1);
        } else {
            // Create a new user in the users table
            const [userID] = await knex('users').insert({ username });

            // Create a new record in the leaderboard table
            await knex('leaderboard').insert({ user_id: userID, score: 1 });
        }

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
        let user = await knex('users').where({username}).first();

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

            user = await knex('users').where({username}).first();

            // Increment the referrer's score in the leaderboard table by 2500
            if (referred_by) {
                await knex('leaderboard')
                    .where({ user_id: referred_by })
                    .increment('score', 2500);
            }
        }

        const { score } = await knex('leaderboard')
            .where({ user_id: user.id })
            .select('score')
            .first();

        const referral_code = GetRefString(username, user.id);
        const referral_link = `https://${process.env.TELEGRAM_APP_URL}?startapp=${referral_code}`;

        res.status(200).json({ username, score, referral_link });
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

// API route to handle POST /api/wallet
router.post('/wallet', async (req, res) => {
    const { username, wallet } = req.body;

    try {
        // Validate Solana wallet address
        if (!PublicKey.isOnCurve(wallet)) {
            return res.status(400).send('Invalid Solana address!');
        }

        // Check if the user exists in the users table
        const user = await knex('users').where({username}).first();

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

module.exports = router;