const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.get("/courses", getCourses); // Endpoint to retrieve all courses with optional filters
router.get("/courses/:id", getCourseById); // Endpoint to retrieve a specific course by ID

router.post("/courses", isAdmin, createCourse);
router.put("/courses/:courseId", isAdmin, updateCourse);
router.delete("/courses/:courseId", isAdmin, deleteCourse);
module.exports = router;
