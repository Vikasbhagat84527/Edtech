// src/controllers/courseController.js

const prisma = require("../../prisma/prismaClient");

// Create a new course
async function createCourse(req, res) {
  const { title, description, subject, standard } = req.body;
  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject,
        standard,
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
  const { subject, standard } = req.query;
  try {
    const courses = await prisma.course.findMany({
      where: {
        ...(subject && { subject }),
        ...(standard && { standard: parseInt(standard) }),
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

module.exports = { createCourse, getCourses, getCourseById };
