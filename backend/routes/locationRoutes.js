const express = require('express');
const Router = express.Router();

const {createLocation, getAllLocations} = require('../controllers/locationController.js');
const userAuth = require('../middlewares/userAuth.js');

Router.post('/new', userAuth, createLocation);
Router.get('/get-locations', userAuth, getAllLocations);

module.exports = Router;