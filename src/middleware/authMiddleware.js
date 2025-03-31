const jwt = require("jsonwebtoken");
const { db } = require("../config/firebaseConfig");

// Middleware xác thực token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Không tìm thấy token xác thực",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await db.collection("users").doc(decoded.id).get();

    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: "Người dùng không tồn tại",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Token không hợp lệ",
    });
  }
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Bạn không có quyền truy cập",
    });
  }
  next();
};

// Middleware kiểm tra quyền user
const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      error: "Bạn không có quyền truy cập",
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
  isUser,
};
