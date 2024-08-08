/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // select all users who have been referred by someone
    const users = await knex('users').whereNotNull('referred_by');

    // insert the referred users into the referrals table
    for (const user of users) {
        await knex('referrals').insert({
            user_id: user.id,
            referred_by: user.referred_by,
            bonus: 2500,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
