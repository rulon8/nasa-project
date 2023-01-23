const { getPlanets } = require('../../models/planets.model');

async function getAllPlanets (request, response) {
    return response.status(200).json(getPlanets());
}

module.exports = getAllPlanets;