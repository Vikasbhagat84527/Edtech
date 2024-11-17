const prisma = require("../../prisma/prismaClient");
const { createNotification } = require("./notificationController");

// Submit Feedback
async function submitFeedback(req, res) {
  const { userId, content } = req.body;
  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId,
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

module.exports = { submitFeedback, getAllFeedback };
