const express = require('express');
const router = express.Router();
const leaderBoardController = require('../controller/LeaderBoard');
const {validateToken} = require("../middleware/tokken");

router.get('/premium',validateToken,leaderBoardController.getLeaderBoard);
router.get('/non-premium',validateToken,leaderBoardController.getLeaderBoard2);
module.exports = router;