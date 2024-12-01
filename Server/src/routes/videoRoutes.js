const express = require("express");
const {
  searchVideos,
  getVideosByType,
  deleteVideo,
} = require("../controllers/videoController");
const { isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/videos/search", searchVideos);
router.get("/videos/:type", getVideosByType);
router.delete("/videos/:videoId", isAdmin, deleteVideo);

module.exports = router;
