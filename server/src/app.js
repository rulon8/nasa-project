const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

//Allow cors requests from React app.
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(morgan('combined')); // Logging
app.use(express.json()); // Accept and return JSON bodies.
app.use(express.static(path.join(__dirname, '..', 'public'))); // Serve static webpage located at the 'public' folder.

app.use('/v1', api);

// Serve React app from Node.
app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;