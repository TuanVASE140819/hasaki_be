const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  authenticateToken,
} = require("../controllers/authenticationController");

// Public routes (no authentication needed)
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
