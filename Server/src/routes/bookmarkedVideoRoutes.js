const express = require("express");
const {
  bookmarkVideo,
  removeBookmark,
  getBookmarkedVideos,
} = require("../controllers/bookmarkedVideoController");
const router = express.Router();

router.post("/bookmark", bookmarkVideo);
router.delete("/remove-bookmark", removeBookmark);
router.get("/:userId/bookmarked-videos", getBookmarkedVideos);

module.exports = router;
