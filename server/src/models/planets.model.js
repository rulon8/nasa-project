const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planetsModel = require('./planets.mongo');

// Load kepler planet data from CSV file and filter out uninhabitable planets.
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({ 
      comment: '#',
      columns: true,
    }))
    .on('data', async (chunk) => {
      if (isHabitablePlanet(chunk)) {
        await savePlanet(chunk);
      }
    })
    .on('error', (err) => {
      console.log(err);
      reject(err);
    })
    .on('end', () => {
      console.log(`We found ${habitablePlanets.length} habitable planets!`);
      resolve();
    });
  });
}

/** 
 * Checks if a planet is habitable.
 * A planet is habitable if it is confirmed, 
 * has a radius less than 1.6 times the radius of Earth,
 * and has an insolation value between 0.36 and 1.11 the one of Earth.
 **/
function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

async function savePlanet(planet) {
  try {
    await planetsModel.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch (err) {
    console.log(`Could not save planet ${chunk.kepler_name}`);
    console.log(err);
  }
}

module.exports = {
  loadPlanetsData,
  getPlanets
};