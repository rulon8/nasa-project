const { 
  getLaunches,
  addLaunch,
} = require('../../models/launches.model');

function getAllLaunches(request, response) {
  return response.status(200).json(getLaunches());
}

function addNewLaunch(request, response) {
  const launch = request.body;

  launch.launchDate = new Date(launch.launchDate);

  addLaunch(launch);
  return response.status(201).json(launch);
}

module.exports = {
  getAllLaunches,
  addNewLaunch
};