const { 
  getLaunches,
  addLaunch,
} = require('../../models/launches.model');

function getAllLaunches(request, response) {
  return response.status(200).json(getLaunches());
}

function addNewLaunch(request, response) {
  const launch = request.body;

  //Check if required values are present.
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return response.status(400).json({
      error: 'Missing required launch property'
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  
  //Check if date is valid.
  if(isNaN(launch.launchDate)) {
    return response.status(400).json({
      error: 'Invalid launch date'
    });
  }

  addLaunch(launch);
  return response.status(201).json(launch);
}

module.exports = {
  getAllLaunches,
  addNewLaunch
};