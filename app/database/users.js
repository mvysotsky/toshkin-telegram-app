const knex = require('./knex');

/**
 * Get user data by username
 * @param {string} username
 * @returns {Promise<{id: number, username: string, wallet: string, created_at: Date, updated_at: Date, referred_by: number}>}
 */
const GetUserData = async (username) => {
    return knex('users').where({username}).first();
}

/**
 * Get fraud data for a user (only for today)
 * @param {number} user_id
 * @returns {Promise<{id: number, user_id: number, user_data: string, ip_address: string, user_agent: string, created_at: Date, count: number}>}
 */
const GetFraudData = async (user_id) => {
    return knex('fraud_reports')
        .where({user_id})
        .andWhere(knex.raw('DATE(fraud_reports.created_at) = CURDATE()'))
        .first();
}

/**
 * Get fraud count for a user (only for today)
 * @param {number} user_id
 * @returns {Promise<{number}>}
 */
const GetFraudCount = async (user_id) => {
    const fraud_data = await GetFraudData(user_id);

    return fraud_data ? fraud_data.count : 0;
}


module.exports = { GetUserData, GetFraudData, GetFraudCount };