const express = require('express');
const router = express.Router();
const downloadController = require('../controller/DownloadExpenses');
const {validateToken} = require("../middleware/tokken");

router.get('/download-expenses',validateToken,downloadController.downloadExpenses);
router.get('/download-url-list',validateToken,downloadController.previousDownloads);

module.exports = router;