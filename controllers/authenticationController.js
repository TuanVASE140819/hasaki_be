const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const db = require("../config/firebaseConfig");

// Secret keys for JWT (in production, use environment variables)
const ACCESS_TOKEN_SECRET = "your-access-token-secret-key";
const REFRESH_TOKEN_SECRET = "your-refresh-token-secret-key";

// Store active refresh tokens
// (in production, store in database instead of memory)
let refreshTokens = [];

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if email already exists
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create new user document
    const timestamp = new Date();
    const userData = {
      name,
      email,
      password, // In production, hash this password
      role: "user",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Add user to database
    const userDoc = await usersRef.add(userData);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      userId: userDoc.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Login with email and password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // In a real app, you would authenticate against Firebase Auth
    // This is a simplified example that checks a 'users' collection in Firestore
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const userData = snapshot.docs[0].data();
    const userId = snapshot.docs[0].id;

    // In production, you should use proper password comparison
    // This is simplified for demonstration
    if (password !== userData.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create user object for token payload
    const user = {
      id: userId,
      email: userData.email,
      name: userData.name,
      role: userData.role || "user",
    };

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Store refresh token
    refreshTokens.push(refreshToken);

    // In production, store in database
    await db.collection("tokens").add({
      userId: userId,
      token: refreshToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role || "user",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Refresh token to get new access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Check if refresh token exists in our storage
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Verify refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.json({
        success: true,
        accessToken,
      });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Logout - invalidate refresh token
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Remove from memory storage
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    // Remove from database
    const tokensRef = db.collection("tokens");
    const snapshot = await tokensRef.where("token", "==", refreshToken).get();

    if (!snapshot.empty) {
      const tokenDoc = snapshot.docs[0];
      await tokenDoc.ref.delete();
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get current user profile - protected route that requires authentication
const getProfile = async (req, res) => {
  try {
    // The user object is set by authenticateToken middleware
    const userId = req.user.id;

    // Fetch the latest user data from database
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    // Return user profile without sensitive information
    res.json({
      success: true,
      user: {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role || "user",
        createdAt: userData.createdAt,
        avatar: userData.avatar || null, // Add avatar field
        customerCode:
          userData.customerCode || `KH${userId.substring(0, 6).toUpperCase()}`, // Add customer code field
        // Add any other non-sensitive user fields here
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Helper function to generate access token
function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// Authentication middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token is required" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile, // Add the new profile function to exports
  authenticateToken,
};
