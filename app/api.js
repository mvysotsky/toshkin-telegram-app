const express = require('express');
const router = express.Router();
const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.DATABASE_HOST || 'db',
        port: process.env.DATABASE_PORT || 3306,
        user: 'root',
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'toshkin',
    }
});

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
    const { username } = req.query;

    try {
        // Check if the user exists in the users table
        const user = await knex('users').where({username}).first();

        if (user) {
            // Get the user's score from the leaderboard table
            const { score } = await knex('leaderboard')
                .where({ user_id: user.id })
                .select('score')
                .first();

            res.status(200).json({ username, score });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;