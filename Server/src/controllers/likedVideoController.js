const prisma = require("../../prisma/prismaClient");

// Like a video
async function likeVideo(req, res) {
  const { userId, lessonId } = req.body;
  try {
    const existingLike = await prisma.likedVideo.findFirst({
      where: { userId, lessonId },
    });
    if (existingLike) {
      return res.status(400).json({ message: "Video already liked" });
    }
    const likedVideo = await prisma.likedVideo.create({
      data: { userId, lessonId },
    });
    res.status(201).json({ message: "Video liked", likedVideo });
  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ error: "Failed to like video" });
  }
}

// Unlike a video
async function unlikeVideo(req, res) {
  const { userId, lessonId } = req.body;
  try {
    await prisma.likedVideo.deleteMany({ where: { userId, lessonId } });
    res.status(200).json({ message: "Video unliked" });
  } catch (error) {
    console.error("Error unliking video:", error);
    res.status(500).json({ error: "Failed to unlike video" });
  }
}

// Get all liked videos for a user
async function getLikedVideos(req, res) {
  const { userId } = req.params;
  try {
    const likedVideos = await prisma.likedVideo.findMany({
      where: { userId: parseInt(userId) },
      include: { lesson: true },
    });
    res.json(likedVideos);
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    res.status(500).json({ error: "Failed to fetch liked videos" });
  }
}

module.exports = { likeVideo, unlikeVideo, getLikedVideos };
