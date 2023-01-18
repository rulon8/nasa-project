const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const habitablePlanets = [];

// Load kepler planet data from CSV file and filter out uninhabitable planets.
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
    .pipe(parse({ 
      comment: '#',
      columns: true,
    }))
    .on('data', (chunk) => {
      if (isHabitablePlanet(chunk)) {
        habitablePlanets.push(chunk);
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

function getPlanets() {
  return habitablePlanets;
}

module.exports = {
  loadPlanetsData,
  getPlanets
};