const knex = require('./knex');

/**
 * Create a referral record
 * @param {number} user_id
 * @param {number} referred_by
 * @param {number} bonus
 * @returns {Promise<void>}
 */
const CreateReferral = async (user_id, referred_by, bonus = 0) => {
    await knex('referrals').insert({
        user_id: user_id,
        referred_by,
        bonus
    });
}

/**
 * Add referral score to the referrer
 * @param {number} user_id
 * @param {number} referred_by
 * @param {number} score
 * @returns {Promise<void>}
 */
const AddReferralScore = async (user_id, referred_by, score) => {
    const referral_data = await knex('referrals').where({ user_id }).first();

    if (!referral_data) {
        return await CreateReferral(user_id, referred_by, score);
    }

    await knex('referrals')
        .where({ user_id })
        .increment('bonus', score);
}

module.exports = { CreateReferral, AddReferralScore };