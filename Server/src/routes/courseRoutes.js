const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
} = require("../controllers/courseController");
const router = express.Router();

router.post("/courses", createCourse); // Endpoint to create a new course
router.get("/courses", getCourses); // Endpoint to retrieve all courses with optional filters
router.get("/courses/:id", getCourseById); // Endpoint to retrieve a specific course by ID

module.exports = router;
