const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/prismaClient");

async function isAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: "Authorization required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    res.status(403).json({ error: "Unauthorized access" });
  }
}
async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(401).json({ error: "User not found or inactive" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}
module.exports = { isAdmin, authenticateToken };
