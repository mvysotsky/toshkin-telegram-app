const users = require('./users');
const config = require('../config');
const knex = require('./knex');

const AddEnergy = async (user_id, energy) => {
    if (energy === 0) return;
    if (await users.GetFraudData(user_id)) return;
    // Increment the user's energy in the user_energy table by the specified amount
    await knex('user_energy')
        .where({ user_id })
        .increment('energy', energy);
}

const ConsumeEnergy = async (user_id, energy) => {
    if (energy === 0) return;
    // Decrement the user's energy in the user_energy table by the specified amount
    await knex('user_energy')
        .where({ user_id })
        .decrement('energy', energy);
}

const GetEnergyData = async (user_id) => {
    const data = await knex('user_energy')
        .where({user_id})
        .select('energy', 'max_energy', 'last_energy_regen')
        .first();
    const time_to_regen = config.ENERGY_REGEN_INTERVAL - (Date.now() - new Date(data.last_energy_regen));
    return {...data, time_to_regen}
}

module.exports = { AddEnergy, ConsumeEnergy, GetEnergyData };