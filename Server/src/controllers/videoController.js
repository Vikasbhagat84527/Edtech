const prisma = require("../../prisma/prismaClient");

async function searchVideos(req, res) {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const videos = await prisma.lesson.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
      take: 10,
    });
    if (videos.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    res.json(videos);
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
}

async function getVideosByType(req, res) {
  const { type } = req.params;

  try {
    let videos = [];
    switch (type) {
      case "watch-history":
        videos = await prisma.watchHistory.findMany({
          where: { userId: req.userId },
          include: { lesson: true },
        });
        break;
      case "liked-videos":
        videos = await prisma.likedVideo.findMany({
          where: { userId: req.userId },
          include: { lesson: true },
        });
        break;
      case "bookmarked-videos":
        videos = await prisma.bookmarkedVideo.findMany({
          where: { userId: req.userId },
          include: { lesson: true },
        });
        break;
      default:
        return res.status(400).json({ error: "Invalid video type" });
    }

    const response = videos.map((video) => ({
      id: video.lesson.id,
      title: video.lesson.title,
      thumbnail: video.lesson.contentUrl,
      duration: video.lesson.duration,
    }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching videos by type:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
}

async function deleteVideo(req, res) {
  const { videoId } = req.params;

  try {
    await prisma.lesson.delete({
      where: { id: parseInt(videoId) },
    });
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
}

module.exports = {
  searchVideos,
  getVideosByType,
  deleteVideo,
};
