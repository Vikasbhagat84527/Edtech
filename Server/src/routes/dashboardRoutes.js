// src/routes/dashboardRoutes.js

const express = require("express");
const {
  getUserDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const { isAdmin, authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/dashboard/admin", isAdmin, getAdminDashboard);
router.get("/dashboard/user", authenticateToken, getUserDashboard);

module.exports = router;
