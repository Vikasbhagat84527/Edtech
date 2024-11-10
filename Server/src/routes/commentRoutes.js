const express = require("express");
const {
  createComment,
  getCommentsByLesson,
} = require("../controllers/commentController");
const router = express.Router();

router.post("/comments", createComment);
router.get("/comments/lesson/:lessonId", getCommentsByLesson);

module.exports = router;
