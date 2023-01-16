const { getLaunches } = require('../../models/launches.model');

function getAllLaunches(request, response) {
  return response.status(200).json(getLaunches());
}

module.exports = {
  getAllLaunches,
};