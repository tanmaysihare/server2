const express = require('express');

const purchaseController = require('../controller/Purchase');

const {validateToken} = require('../middleware/tokken');

const router = express.Router();

router.get('/premium_membership',validateToken,purchaseController.purchasePremium);

router.post('/update_transaction_status',validateToken,purchaseController.update_transaction_status);

router.get('/transaction_status',validateToken,purchaseController.getStatus);

module.exports = router;