const prisma = require("../../prisma/prismaClient");

// Bookmark a video
async function bookmarkVideo(req, res) {
  const { userId, lessonId } = req.body;
  if (!userId || !lessonId) {
    return res.status(400).json({ error: "userId and lessonId are required" });
  }
  try {
    const existingBookmark = await prisma.bookmarkedVideo.findFirst({
      where: { userId, lessonId },
    });
    if (existingBookmark) {
      return res.status(400).json({ message: "Video already bookmarked" });
    }
    const bookmarkedVideo = await prisma.bookmarkedVideo.create({
      data: { userId, lessonId },
    });
    res.status(201).json({ message: "Video bookmarked", bookmarkedVideo });
  } catch (error) {
    console.error("Error bookmarking video:", error);
    res.status(500).json({ error: "Failed to bookmark video" });
  }
}

// Remove a bookmark
async function removeBookmark(req, res) {
  const { userId, lessonId } = req.body;
  try {
    await prisma.bookmarkedVideo.deleteMany({ where: { userId, lessonId } });
    res.status(200).json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
}

// Get all bookmarked videos for a user
async function getBookmarkedVideos(req, res) {
  const { userId } = req.params;
  try {
    const bookmarkedVideos = await prisma.bookmarkedVideo.findMany({
      where: { userId: parseInt(userId) },
      include: { lesson: true },
    });
    res.json(bookmarkedVideos);
  } catch (error) {
    console.error("Error fetching bookmarked videos:", error);
    res.status(500).json({ error: "Failed to fetch bookmarked videos" });
  }
}

module.exports = { bookmarkVideo, removeBookmark, getBookmarkedVideos };
