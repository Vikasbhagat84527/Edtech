const express = require("express");
const {
  signUp,
  login,
  refreshToken,
  logout,
  signUpAdmin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/signup-admin", signUpAdmin);

module.exports = router;
