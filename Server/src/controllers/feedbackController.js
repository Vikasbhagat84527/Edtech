const prisma = require("../../prisma/prismaClient");
const { createNotification } = require("./notificationController");

// Submit Feedback
async function submitFeedback(req, res) {
  const { userId, courseId, lessonId, content } = req.body;
  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        courseId,
        lessonId,
        content,
      },
    });

    // Notify admin if feedback contains critical words
    const criticalKeywords = ["issue", "bug", "urgent", "problem"];
    if (criticalKeywords.some((keyword) => content.includes(keyword))) {
      createNotification("Critical feedback received: " + content, "feedback");
    }

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
}

// Get Feedback for a Course or Lesson
async function getFeedback(req, res) {
  const { courseId, lessonId } = req.params;
  try {
    const feedback = await prisma.feedback.findMany({
      where: {
        courseId: courseId ? parseInt(courseId) : undefined,
        lessonId: lessonId ? parseInt(lessonId) : undefined,
      },
      include: { User: { select: { firstName: true, lastName: true } } },
    });
    res.json(feedback);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
}

// Admin: Get All Feedback
async function getAllFeedback(req, res) {
  try {
    const feedback = await prisma.feedback.findMany({
      include: { User: { select: { firstName: true, lastName: true } } },
    });
    res.json(feedback);
  } catch (error) {
    console.error("Error retrieving all feedback:", error);
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
}

module.exports = { submitFeedback, getFeedback, getAllFeedback };
