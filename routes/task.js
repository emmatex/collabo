const express = require('express');
const router = express.Router();
const taskController = require('../controller/task');

router.get('/task', taskController.createTask);

router.get('/task/:id', taskController.getSingleTask);


module.exports = router;