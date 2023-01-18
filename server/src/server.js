const http = require('http');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  // Wait for planet data to load from CSV file.
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();