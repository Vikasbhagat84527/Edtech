// src/routes/lessonRoutes.js

const express = require("express");
const {
  createLesson,
  getLessonsByCourseId,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const { isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/lessons/course/:courseId", getLessonsByCourseId); // Get all lessons for a course
router.get("/lessons/:id", getLessonById); // Get a specific lesson by ID

router.post("/lessons", isAdmin, createLesson);
router.put("/lessons/:lessonId", isAdmin, updateLesson);
router.delete("/lessons/:lessonId", isAdmin, deleteLesson);
module.exports = router;
