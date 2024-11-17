const prisma = require("../../prisma/prismaClient");
async function getUserDashboard(req, res) {
  const userId = req.userId;
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
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
    const feedbackEntries = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // Retrieve the latest 10 feedback entries
    });
    const notificationCount = await prisma.notification.count({
      where: { isRead: false }, // Assuming a `read` field indicates unread notifications
    });

    res.json({
      activeUsersCount,
      coursesCount,
      lessonsCount,
      recentSubscriptions,
      lessonsBySubjectCount,
      feedbackEntries,
      notificationCount,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ error: "Failed to fetch admin dashboard" });
  }
}
module.exports = {
  getUserDashboard,
  getAdminDashboard,
};
