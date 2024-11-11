const prisma = require("../../prisma/prismaClient");

// Add a lesson to the watch history
async function addWatchHistory(req, res) {
  const { userId, lessonId } = req.body;
  try {
    const watchEntry = await prisma.watchHistory.create({
      data: {
        userId,
        lessonId,
      },
    });
    res.status(201).json({ message: "Added to watch history", watchEntry });
  } catch (error) {
    console.error("Error adding to watch history:", error);
    res.status(500).json({ error: "Failed to add to watch history" });
  }
}

// Fetch the watch history for a user
async function getWatchHistory(req, res) {
  const { userId } = req.params;
  try {
    const watchHistory = await prisma.watchHistory.findMany({
      where: { userId: parseInt(userId) },
      include: { lesson: true },
    });
    res.json({ watchHistory });
  } catch (error) {
    console.error("Error fetching watch history:", error);
    res.status(500).json({ error: "Failed to fetch watch history" });
  }
}

module.exports = { addWatchHistory, getWatchHistory };
