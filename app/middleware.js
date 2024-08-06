const path = require('path');

/**
 * Checks user agent and serves the appropriate HTML file
 * @param {Request} req
 * @param {Response} res
 */
const CheckUserAgent = (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Android|iPhone|iPad|iPod/.test(userAgent);
    const isDevMode = (process.env.ENABLE_DEV_MODE === "true") ?? false; // Read from .env

    if (isMobile) {
        res.render('mobile', { ENABLE_DEV_MODE: isDevMode });
    } else {
        res.render('desktop', { ENABLE_DEV_MODE: isDevMode });
    }
};

/**
 * Logs the IP address of the request
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const LogRequest = (req, res, next) => {
    console.log('Request IP:', req.ip, 'User-Agent:', req.headers['user-agent']);
    next();
};

module.exports = { CheckUserAgent, LogRequest };