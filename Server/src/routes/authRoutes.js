const express = require("express");
const {
  signUp,
  login,
  refreshToken,
  logout,
  signUpAdmin,
  validateToken,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/signup-admin", signUpAdmin);
router.get("/validate-token", validateToken);

module.exports = router;
