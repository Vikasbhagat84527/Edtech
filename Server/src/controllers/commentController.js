const prisma = require("../../prisma/prismaClient");

// Create a comment on a lesson
async function createComment(req, res) {
  const { content, userId, lessonId } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: { content, userId, lessonId },
    });
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
}

// Get comments by lesson ID
async function getCommentsByLesson(req, res) {
  const { lessonId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { lessonId: parseInt(lessonId) },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments" });
  }
}

module.exports = { createComment, getCommentsByLesson };
