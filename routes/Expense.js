const express = require('express');
const router = express.Router();
const expenseController = require('../controller/Expense');
const {validateToken} = require("../middleware/tokken");

router.post("/",validateToken,expenseController.postExpense);
router.get("/",validateToken,expenseController.getExpense);
router.delete("/:id",validateToken,expenseController.deleteExpense);

module.exports = router;