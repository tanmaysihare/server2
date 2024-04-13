const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../controller/ForgetPassword');


router.post('/forget-password',forgetPasswordController.postForgetPassword);
router.get('/reset-password/:uuid',forgetPasswordController.getResetPassword);
router.post('/new-password',forgetPasswordController.postNewPassword);

module.exports = router;