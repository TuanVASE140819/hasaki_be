const express = require("express");
const router = express.Router();
const { db, collection, getDocs } = require("../config/firebaseConfig");

router.get("/test-db", async (req, res) => {
  try {
    // Thử lấy danh sách users
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);

    // Chuyển đổi dữ liệu
    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      success: true,
      message: "Kết nối database thành công",
      data: {
        users: users,
      },
    });
  } catch (error) {
    console.error("Lỗi test database:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Lỗi kết nối database",
    });
  }
});

module.exports = router;
