const express = require('express');
const router = express.Router();
const userController = require('../controller/User');


router.post("/signup", userController.postSignup);
router.post("/login",userController.postLogin2);

module.exports = router; 