/** @type {import('knex')} */
const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.DATABASE_HOST || 'db',
        port: process.env.DATABASE_PORT || 3306,
        user: 'root',
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'toshkin',
    }
});

module.exports = knex;