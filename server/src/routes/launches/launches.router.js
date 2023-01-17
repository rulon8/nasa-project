const express = require('express');

const { 
  getAllLaunches,
  addNewLaunch
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', getAllLaunches);
launchesRouter.post('/', addNewLaunch);

module.exports = launchesRouter;