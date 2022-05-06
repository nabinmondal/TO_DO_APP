const express = require('express');
const userController = require('../contorllers/userController');


const router = express.Router();

router.post('/reg',userController.registerUser);
router.post('/login',userController.loginUser);
router.post('/password',userController.changePassword);

module.exports = router;

