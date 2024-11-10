const prisma = require("../../prisma/prismaClient");

async function createLesson(req, res) {
  const { title, contentUrl, courseId } = req.body;
  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        contentUrl,
        courseId: parseInt(courseId),
      },
    });
    res.json({ message: "Lesson created successfully", lesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ error: "Lesson creation failed" });
  }
}
async function getLessonsByCourseId(req, res) {
  const { courseId } = req.params;
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: parseInt(courseId) },
    });
    res.json(lessons);
  } catch (error) {
    console.error("Error retrieving lessons:", error);
    res.status(500).json({ error: "Failed to retrieve lessons" });
  }
}

async function getLessonById(req, res) {
  const { id } = req.params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
    });
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  } catch (error) {
    console.error("Error retrieving lesson:", error);
    res.status(500).json({ error: "Failed to retrieve lesson" });
  }
}

module.exports = { createLesson, getLessonsByCourseId, getLessonById };
