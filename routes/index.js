const express = require('express');
const router = express.Router();
const indexController = require('../controller/index');

router.get('/', indexController.LandingPage);

router.get('/home', indexController.homePage);

module.exports = router;