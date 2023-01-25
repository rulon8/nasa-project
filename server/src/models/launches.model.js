const axios = require('axios');

const launchesModel = require('./launches.mongo');
const planetsModel = require('./planets.mongo');

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const DEFAULT_FLIGHT_NUMBER = 100;

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  
  if (response.status !== 200) {
    console.log('Problem loading SpaceX launch data: ' + response.status);
    throw new Error('SpaceX launch data download failed.');
  }
  
  const launchDocs = response.data.docs;
  
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launchData = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data already loaded.');
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesModel.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getLaunches() {
  return await launchesModel.find({}, {
    '__v': 0,
    '_id': 0,
  });
}

async function saveLaunch(launch) {
  await launchesModel.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  },
  launch,
  {
    upsert: true,
  });
}

/** 
 * Create new launch with autogenerated
 * flight number and default values for properties
 * that are not set in the front-end app.
 **/
async function scheduleLaunch(launch) {
  const planet = await planetsModel.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No planet was found for launch target.');
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
  });

  await saveLaunch(newLaunch);
}

// Mark launch as aborted. Does NOT delete the launch.
async function abortLaunchById(launchId) {
  const aborted = await launchesModel.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });

  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  getLaunches,
  scheduleLaunch,
  existsLaunchWithId,
  abortLaunchById
};