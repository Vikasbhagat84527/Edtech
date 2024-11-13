const express = require("express");
const {
  getUnreadNotifications,
  markNotificationAsRead,
  getNotificationCounts,
} = require("../controllers/notificationController");
const { isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/notifications/unread", isAdmin, getUnreadNotifications);
router.patch(
  "/notifications/:notificationId/read",
  isAdmin,
  markNotificationAsRead
);
router.get("/notifications/counts", isAdmin, getNotificationCounts);

module.exports = router;
