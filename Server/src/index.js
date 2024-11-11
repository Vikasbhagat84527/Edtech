const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likedVideoRoutes = require("./routes/likedVideoRoutes");
const bookmarkedVideoRoutes = require("./routes/bookmarkedVideoRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const watchHistoryRoutes = require("./routes/watchHistoryRoutes");
require("dotenv").config();
const prisma = require("../prisma/prismaClient");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", lessonRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", commentRoutes);
app.use("/api/likes", likedVideoRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", bookmarkedVideoRoutes);
app.use("/api", watchHistoryRoutes);

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server running on port ${PORT}`);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
});
