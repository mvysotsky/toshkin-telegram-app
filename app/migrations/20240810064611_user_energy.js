/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('user_energy', (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('energy').unsigned().defaultTo(5000); // Default energy value
        table.integer('max_energy').unsigned().defaultTo(5000); // Default energy value
        table.timestamp('last_energy_regen').defaultTo(knex.fn.now()); // Default last used energy time
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('user_energy');
};