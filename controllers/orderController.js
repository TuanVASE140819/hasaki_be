const db = require("../config/firebaseConfig");

// Lấy danh sách đơn hàng của người dùng
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware authenticateToken
    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware authenticateToken
    const { items, total, address } = req.body;

    if (!items || !total || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newOrder = {
      userId,
      items,
      total,
      address,
      status: "pending", // Trạng thái mặc định
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection("orders").add(newOrder);
    res.status(201).json({
      success: true,
      orderId: docRef.id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Lấy chi tiết đơn hàng
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("orders").doc(id).get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error getting order:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng (chỉ dành cho quản trị viên)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const doc = await db.collection("orders").doc(id).get();
    if (!doc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await db.collection("orders").doc(id).update({
      status,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  getOrder,
  updateOrderStatus,
};
