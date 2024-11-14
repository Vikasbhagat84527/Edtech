// src/controllers/courseController.js

const prisma = require("../../prisma/prismaClient");

// Create a new course
async function createCourse(req, res) {
  const { title, description, subject } = req.body;
  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject,
      },
    });
    res.json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Course creation failed" });
  }
}

// Get all courses with optional filters
async function getCourses(req, res) {
  const { subject } = req.query;
  try {
    const courses = await prisma.course.findMany({
      where: {
        ...(subject && { subject }),
      },
    });
    res.json(courses);
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
}

// Get a specific course by ID
async function getCourseById(req, res) {
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error retrieving course:", error);
    res.status(500).json({ error: "Failed to retrieve course" });
  }
}
async function updateCourse(req, res) {
  const { courseId } = req.params;
  const { title, description } = req.body;
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: { title, description },
    });
    res.json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
}
async function deleteCourse(req, res) {
  const { courseId } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(courseId) },
    });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
}
module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
