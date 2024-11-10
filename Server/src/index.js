const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const commentRoutes = require("./routes/commentRoutes");
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

app.get("/api/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Test route working" });
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server running on port ${PORT}`);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
});
