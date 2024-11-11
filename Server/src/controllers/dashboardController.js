// src/controllers/dashboardController.js

const prisma = require("../../prisma/prismaClient");

// Fetch liked videos for the user
async function getLikedVideos(req, res) {
  const userId = req.userId; // assuming userId is added to req via middleware
  try {
    const likedVideos = await prisma.likedVideo.findMany({
      where: { userId },
      include: { lesson: true },
    });
    res.json({ likedVideos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch liked videos" });
  }
}

// Fetch bookmarked videos for the user
async function getBookmarkedVideos(req, res) {
  const userId = req.userId;
  try {
    const bookmarkedVideos = await prisma.bookmarkedVideo.findMany({
      where: { userId },
      include: { lesson: true },
    });
    res.json({ bookmarkedVideos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookmarked videos" });
  }
}

// Fetch watch history for the user
async function getWatchHistory(req, res) {
  const userId = req.userId;
  try {
    const watchHistory = await prisma.watchHistory.findMany({
      where: { userId },
      include: { lesson: true },
    });
    res.json({ watchHistory });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watch history" });
  }
}

// Fetch subscription status for the user
async function getSubscriptionStatus(req, res) {
  const userId = req.userId;
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    if (!subscription) {
      return res.status(404).json({ error: "No subscription found" });
    }
    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
}

// Count active users
async function getActiveUsersCount(req, res) {
  try {
    const activeUsersCount = await prisma.user.count({
      where: { isActive: true }, // assuming there’s an isActive field
    });
    res.json({ activeUsersCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count active users" });
  }
}

// Count total courses and lessons
async function getCoursesAndLessonsCount(req, res) {
  try {
    const coursesCount = await prisma.course.count();
    const lessonsCount = await prisma.lesson.count();
    res.json({ coursesCount, lessonsCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
}

// Fetch recent subscriptions
async function getRecentSubscriptions(req, res) {
  try {
    const recentSubscriptions = await prisma.subscription.findMany({
      orderBy: { startDate: "desc" },
      take: 10, // limit to the last 10 subscriptions
    });
    res.json({ recentSubscriptions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent subscriptions" });
  }
}
async function getUserProfile(req, res) {
  const userId = req.userId; // assuming userId is added to req via middleware
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        standard: true,
        location: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}
async function getUserDashboard(req, res) {
  const userId = req.userId;
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        standard: true,
        location: true,
        Subscription: true,
        likedVideos: { include: { lesson: true } },
        bookmarkedVideos: { include: { lesson: true } },
        watchHistory: { include: { lesson: true } },
      },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ userProfile });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res.status(500).json({ error: "Failed to fetch user dashboard" });
  }
}
async function getAdminDashboard(req, res) {
  try {
    const activeUsersCount = await prisma.user.count({
      where: { isActive: true },
    });
    const coursesCount = await prisma.course.count();
    const lessonsCount = await prisma.lesson.count();
    const recentSubscriptions = await prisma.subscription.findMany({
      orderBy: { startDate: "desc" },
      take: 10,
    });

    // Subject-wise lesson count
    const lessonsBySubject = await prisma.lesson.groupBy({
      by: ["subject"],
      _count: {
        subject: true,
      },
    });

    const lessonsBySubjectCount = lessonsBySubject.map((lesson) => ({
      subject: lesson.subject,
      lessonCount: lesson._count.subject,
    }));

    res.json({
      activeUsersCount,
      coursesCount,
      lessonsCount,
      recentSubscriptions,
      lessonsBySubjectCount,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ error: "Failed to fetch admin dashboard" });
  }
}
module.exports = {
  getUserProfile,
  getLikedVideos,
  getBookmarkedVideos,
  getWatchHistory,
  getSubscriptionStatus,
  getActiveUsersCount,
  getCoursesAndLessonsCount,
  getRecentSubscriptions,
  getUserDashboard,
  getAdminDashboard,
};
