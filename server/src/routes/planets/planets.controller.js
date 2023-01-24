const { getPlanets } = require('../../models/planets.model');

async function getAllPlanets (request, response) {
    return response.status(200).json(await getPlanets());
}

module.exports = getAllPlanets;