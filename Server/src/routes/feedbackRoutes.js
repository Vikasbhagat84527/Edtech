const express = require("express");
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/feedback", authenticateToken, submitFeedback);
router.get("/admin/feedback", isAdmin, getAllFeedback);

module.exports = router;
