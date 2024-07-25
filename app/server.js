// server.js
const express = require('express');
const path = require('path');
const bot = require('./bot'); // Import the bot instance

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'app/view' directory
app.use(express.static(path.join(__dirname, 'view')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});