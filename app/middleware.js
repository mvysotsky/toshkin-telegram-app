const path = require('path');

/**
 * Checks user agent and serves the appropriate HTML file
 * @param {Request} req
 * @param {Response} res
 */
const CheckUserAgent = (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Android|iPhone|iPad|iPod/.test(userAgent);

    if (isMobile) {
        res.sendFile(path.join(__dirname, './view/mobile.html'));
    } else {
        res.sendFile(path.join(__dirname, './view/desktop.html'));
    }
};

module.exports = { CheckUserAgent };