const crc = require('crc');

/**
 * Generates a unique reference string
 * @param {string} username
 * @param {string} created_at
 * @returns {string} The reference string generated from the username and created_at
 */
const GetRefString = (username, created_at) => {
    const refString = `${username}${created_at}`;

    return crc.crc32(refString).toString(16);
}

module.exports = { GetRefString };