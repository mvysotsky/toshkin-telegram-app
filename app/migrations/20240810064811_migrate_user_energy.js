/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const users = await knex('users').select('id');

    for (const user of users) {
        await knex('user_energy').insert({
            user_id: user.id,
            energy: 5000, // Initial energy value for all users
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    // If you want to undo this migration
    await knex('user_energy').truncate();
};