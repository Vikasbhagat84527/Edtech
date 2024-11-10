// src/routes/lessonRoutes.js

const express = require("express");
const {
  createLesson,
  getLessonsByCourseId,
  getLessonById,
} = require("../controllers/lessonController");
const router = express.Router();

router.post("/lessons", createLesson); // Endpoint to create a new lesson
router.get("/lessons/course/:courseId", getLessonsByCourseId); // Get all lessons for a course
router.get("/lessons/:id", getLessonById); // Get a specific lesson by ID

module.exports = router;
