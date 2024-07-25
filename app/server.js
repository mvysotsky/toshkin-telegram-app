const express = require('express');
const path = require('path');
const bot = require('./bot'); // Import the bot instance
const apiRoutes = require('./api'); // Import the API routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'app/view' directory
app.use(express.static(path.join(__dirname, 'view')));

// Use the API routes
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});