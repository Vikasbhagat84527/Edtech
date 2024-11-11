const express = require("express");
const {
  likeVideo,
  unlikeVideo,
  getLikedVideos,
} = require("../controllers/likedVideoController");
const router = express.Router();

router.post("/like", likeVideo);
router.delete("/unlike", unlikeVideo);
router.get("/:userId/liked-videos", getLikedVideos);

module.exports = router;
