const express = require("express");
const router = express.Router();
const {
  authenticateToken,
} = require("../controllers/authenticationController");
const {
  getOrders,
  createOrder,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

// Các route yêu cầu xác thực
router.use(authenticateToken);

router.get("/", getOrders); // Lấy danh sách đơn hàng
router.post("/", createOrder); // Tạo đơn hàng mới
router.get("/:id", getOrder); // Lấy chi tiết đơn hàng
router.put("/:id/status", updateOrderStatus); // Cập nhật trạng thái đơn hàng

module.exports = router;
