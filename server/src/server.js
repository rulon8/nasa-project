const http = require('http');

const app = require('./app');

const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  // Connect to MongoDB.
  await mongoConnect();

  // Wait for planet data to load from CSV file.
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();