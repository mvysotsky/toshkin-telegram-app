const users = require('./users');
const config = require('../config');
const knex = require('./knex');

const AddScore = async (user_id, score, referred_by) => {
    if (score === 0) return;

    // Increment the user's score in the leaderboard table by the specified amount
    await knex('leaderboard')
        .where({ user_id })
        .increment('score', score);

    // Check if user has referred_by and increment the referrer's score in the leaderboard and in referrals table
    if (referred_by) {
        const bonus_score = Math.round(score * config.SCORE_REFERRAL_PERCENTAGE);
        const referral_user = await users.GetUserDataById(referred_by);

        if (!referral_user) {
            console.error(`Referrer user not found: ${referred_by}`);
            return;
        }

        await AddScore(referred_by, bonus_score, referral_user.referred_by);
    }
}

module.exports = { AddScore };