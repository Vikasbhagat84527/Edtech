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
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Set userId in req
    next();
  } catch (error) {
    res.status(403).json({ error: "Unauthorized access" });
  }
}
module.exports = { isAdmin, authenticateToken };
