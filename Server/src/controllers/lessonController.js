const prisma = require("../../prisma/prismaClient");

async function createLesson(req, res) {
  const { title, description, contentUrl, courseId } = req.body;
  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
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

async function updateLesson(req, res) {
  const { lessonId } = req.params;
  const { title, description, contentUrl, courseId } = req.body;

  try {
    const updatedLesson = await prisma.lesson.update({
      where: { id: parseInt(lessonId) },
      data: { title, description, contentUrl, courseId },
    });
    res.json({ message: "Lesson updated successfully", updatedLesson });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ error: "Failed to update lesson" });
  }
}

// Delete a specific lesson
async function deleteLesson(req, res) {
  const { lessonId } = req.params;

  try {
    await prisma.lesson.delete({
      where: { id: parseInt(lessonId) },
    });
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
}

module.exports = {
  createLesson,
  getLessonsByCourseId,
  getLessonById,
  updateLesson,
  deleteLesson,
};
