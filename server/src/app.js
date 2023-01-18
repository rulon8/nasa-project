const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

//Allow cors requests from React app.
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(morgan('combined')); // Logging
app.use(express.json()); // Accept and return JSON bodies.
app.use(express.static(path.join(__dirname, '..', 'public'))); // Serve static webpage located at the 'public' folder.

app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

// Serve React app from Node.
app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;