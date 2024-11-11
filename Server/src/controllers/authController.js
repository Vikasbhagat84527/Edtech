const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/prismaClient");
const { z } = require("zod");

function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string(),
  location: z.string().optional(),
  standard: z
    .number()
    .int()
    .min(1, "Standard must be at least 1")
    .max(16, "Standard must be at most 16"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
const adminSignUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

async function signUp(req, res) {
  try {
    const validatedData = signUpSchema.parse(req.body);
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      location,
      standard,
      role,
    } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        location,
        standard,
        role: role || "user",
      },
    });
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error("Error during user registration:", error);
      res.status(500).json({ error: "User registration failed" });
    }
  }
}
async function signUpAdmin(req, res) {
  try {
    // Validate the request body using Zod
    const validatedData = adminSignUpSchema.parse(req.body);
    const { email, password, firstName, lastName } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "admin", // Assign admin role here
      },
    });
    res.json({ message: "Admin registered successfully", admin });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error("Error during admin registration:", error);
      res.status(500).json({ error: "Admin registration failed" });
    }
  }
}

async function login(req, res) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store the refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ error: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user.id);
    res.json({ accessToken });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(403).json({ error: "Token refresh failed" });
  }
}
async function logout(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Logout failed" });
  }
}
module.exports = { signUp, login, refreshToken, logout, signUpAdmin };
