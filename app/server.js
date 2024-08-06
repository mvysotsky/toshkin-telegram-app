const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const router = express.Router();
const bot = require('./bot'); // Import the bot instance
const apiRoutes = require('./api'); // Import the API routes
const knex = require('./database/knex'); // Import the database instance
const {CheckUserAgent} = require('./middleware');

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve main html file
router.get('/', CheckUserAgent);
app.use(router);

// Serve static files from the 'app/view' directory
app.use(express.static(path.join(__dirname, 'view')));

// Use the API routes
app.use('/api', apiRoutes);

async function startServer() {
    try {
        console.log('Running migrations...');
        await knex.migrate.latest();
        console.log('Migrations are up to date');
    } catch (e) {
        try {
            console.log('Rolling back migrations...');
            await knex.migrate.down();
            console.log('Migrations rolled back successfully');
        } catch (rollbackError) {
            console.error('Error rolling back migrations:', rollbackError);
        }
        process.exit(1);
    }

    // Start the HTTP server
    http.createServer(app).listen(HTTP_PORT, () => {
        console.log(`HTTP Server is running on http://localhost:${HTTP_PORT}`);
    });

    try {
        // Load SSL certificate and key
        const sslOptions = {
            key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
            cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.crt'))
        };

        // Start the HTTPS server
        https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
            console.log(`HTTPS Server is running on https://localhost:${HTTPS_PORT}`);
        });
    } catch (e) {
        // Could not load SSL certificate and key. Skipping https server.
    }
}

startServer()
    .then(r => console.log('Server started'))
    .catch(e => console.error('Error starting server:', e));
