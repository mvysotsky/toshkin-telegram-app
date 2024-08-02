const crc = require('crc');

/**
 * Generates a unique reference string
 * @param {string} username
 * @param {number} user_id
 * @returns {string} The reference string generated from the username and user_id
 */
const GetRefString = (username, user_id) => {
    const refString = `${username}${user_id}`;

    return crc.crc32(refString).toString(16);
}

module.exports = { GetRefString };