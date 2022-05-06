const express = require('express');
const router = express.Router();
const taskController = require('../contorllers/taskController');

router.
    route('/:token?').
    post(taskController.createTask).
    get(taskController.getTasks).
    delete(taskController.deleteTask).
    patch(taskController.updateTask)

module.exports = router;  