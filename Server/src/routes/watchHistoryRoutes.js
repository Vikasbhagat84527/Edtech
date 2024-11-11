const express = require("express");
const {
  addWatchHistory,
  getWatchHistory,
} = require("../controllers/watchHistoryController");
const router = express.Router();

router.post("/watch-history", addWatchHistory);
router.get("/watch-history/:userId", getWatchHistory);

module.exports = router;
