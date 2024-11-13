const express = require("express");
const {
  submitFeedback,
  getFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/feedback", authenticateToken, submitFeedback);
router.get("/feedback/course/:courseId", authenticateToken, getFeedback);
router.get("/feedback/lesson/:lessonId", authenticateToken, getFeedback);
router.get("/admin/feedback", isAdmin, getAllFeedback);

module.exports = router;
