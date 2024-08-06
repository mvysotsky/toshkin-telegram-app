const knex = require('./knex');

const migrationName = process.argv[2];

if (!migrationName) {
    console.error('Please provide a migration name.');
    process.exit(1);
}

knex.migrate.make(migrationName)
    .then(() => {
        console.log(`Migration ${migrationName} created successfully.`);
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error creating migration:', err);
        process.exit(1);
    });