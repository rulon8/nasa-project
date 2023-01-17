const express = require('express');

const { 
  getAllLaunches,
  addNewLaunch
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllLaunches);
launchesRouter.post('/launches', addNewLaunch);

module.exports = launchesRouter;