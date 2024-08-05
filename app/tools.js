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

/**
 * Generates a random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns {number} A random number between min and max
 */
const GetRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = { GetRefString, GetRandomNumber };