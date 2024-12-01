const express = require("express");
const {
  getUnreadNotifications,
  markNotificationAsRead,
  getNotificationCounts,
} = require("../controllers/notificationController");
const { isAdmin, authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/notifications/unread", authenticateToken, getUnreadNotifications);
router.patch(
  "/notifications/:notificationId/read",
  authenticateToken,
  markNotificationAsRead
);
router.get("/notifications/counts", isAdmin, getNotificationCounts);

module.exports = router;
