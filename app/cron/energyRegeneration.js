const cron = require('node-cron');
const knex = require('../database/knex'); // Adjust the path to your knex instance
const config = require('../config');

const ENERGY_REGEN_INTERVAL = config.ENERGY_REGEN_INTERVAL; // 4 minutes in milliseconds
const MAX_ENERGY = config.ENERGY_MAXIMUM_VALUE;
const REGEN_AMOUNT = config.ENERGY_REGEN_DEFAULT_VALUE;

async function regenerateEnergy() {
    const users = await knex('user_energy').where('energy', '<', MAX_ENERGY);

    for (const user of users) {
        const timeSinceLastRegen = Date.now() - new Date(user.last_energy_regen).getTime();
        const energyToRegen = Math.floor(timeSinceLastRegen / ENERGY_REGEN_INTERVAL) * REGEN_AMOUNT;

        if (energyToRegen > 0) {
            const newEnergy = Math.min(user.energy + energyToRegen, MAX_ENERGY);
            await knex('user_energy')
                .where({ id: user.id })
                .update({
                    energy: newEnergy,
                    last_energy_regen: knex.fn.now()
                });
        }
    }
}

module.exports = { regenerateEnergy };

// Schedule the cron job to run every minute
cron.schedule('*/15 * * * * *', async () => {
    try {
        await regenerateEnergy();
        console.log('Energy regeneration executed successfully.');
    } catch (error) {
        console.error('Error regenerating energy:', error);
    }
});