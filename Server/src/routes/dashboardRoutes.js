// src/routes/dashboardRoutes.js

const express = require("express");
const {
  getLikedVideos,
  getBookmarkedVideos,
  getWatchHistory,
  getSubscriptionStatus,
  getActiveUsersCount,
  getCoursesAndLessonsCount,
  getRecentSubscriptions,
  getUserProfile,
  getUserDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const { isAdmin, authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/dashboard/profile", authenticateToken, getUserProfile);
router.get("/dashboard/liked-videos", authenticateToken, getLikedVideos);
router.get(
  "/dashboard/bookmarked-videos",
  authenticateToken,
  getBookmarkedVideos
);
router.get("/dashboard/watch-history", authenticateToken, getWatchHistory);
router.get(
  "/dashboard/subscription-status",
  authenticateToken,
  getSubscriptionStatus
);
router.get("/dashboard/admin", isAdmin, getAdminDashboard);
router.get("/dashboard/user", authenticateToken, getUserDashboard);
router.get("/admin/active-users-count", isAdmin, getActiveUsersCount);
router.get("/admin/courses-lessons-count", isAdmin, getCoursesAndLessonsCount);
router.get("/admin/recent-subscriptions", isAdmin, getRecentSubscriptions);

module.exports = router;
