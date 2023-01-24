const { 
  getLaunches,
  addLaunch,
  existsLaunchWithId,
  abortLaunchById
} = require('../../models/launches.model');

async function getAllLaunches(request, response) {
  return response.status(200).json(await getLaunches());
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

function abortLaunch(request, response) {
  const launchId = Number(request.params.id);

  // Check if given launch is present in model.
  if (!existsLaunchWithId(launchId)) {
    return response.status(404).json({
      error: 'Launch not found'
    });
  }

  const aborted = abortLaunchById(launchId);
  return response.status(200).json(aborted);
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch
};