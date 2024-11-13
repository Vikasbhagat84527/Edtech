const prisma = require("../../prisma/prismaClient");

// Create a notification
async function createNotification(message, type) {
  try {
    await prisma.notification.create({
      data: { message, type },
    });
    console.log("Notification created:", message);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

// Fetch unread notifications for admin
async function getUnreadNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { isRead: false },
      orderBy: { createdAt: "desc" },
    });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

// Mark a notification as read
async function markNotificationAsRead(req, res) {
  const { notificationId } = req.params;
  try {
    await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: { isRead: true },
    });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
}

// Fetch unread and read notification counts
async function getNotificationCounts(req, res) {
  try {
    const unreadCount = await prisma.notification.count({
      where: { isRead: false },
    });
    const readCount = await prisma.notification.count({
      where: { isRead: true },
    });
    res.json({ unreadCount, readCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notification counts" });
  }
}

module.exports = {
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead,
  getNotificationCounts,
};
