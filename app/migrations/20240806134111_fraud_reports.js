/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('fraud_reports', table => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users');
        table.string('user_data');
        table.string('ip_address');
        table.string('user_agent');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.integer('count').defaultTo(1);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    console.log('Dropping table fraud_reports');
    await knex.schema.dropTable('fraud_reports');
};
