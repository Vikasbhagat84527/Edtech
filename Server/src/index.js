const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const commentRoutes = require("./routes/commentRoutes");
const videoRoutes = require("./routes/videoRoutes");
const likedVideoRoutes = require("./routes/likedVideoRoutes");
const bookmarkedVideoRoutes = require("./routes/bookmarkedVideoRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const watchHistoryRoutes = require("./routes/watchHistoryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
require("dotenv").config();
const prisma = require("../prisma/prismaClient");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", videoRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", commentRoutes);
app.use("/api/likes", likedVideoRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", bookmarkedVideoRoutes);
app.use("/api", watchHistoryRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", notificationRoutes);

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
});
