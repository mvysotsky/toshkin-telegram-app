const express = require('express');
const router = express.Router();
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DATABASE_HOST || 'db',
        port: process.env.DATABASE_PORT || 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
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
                .where({ username })
                .increment('score', 1);

            res.send(`Score updated for username: ${username}`);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;