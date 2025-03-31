const { db } = require("../config/firebaseConfig");
const { Order, OrderItem } = require("../models/Order");
const { Cart } = require("../models/Cart");
const { Inventory } = require("../models/Inventory");

// Tạo đơn hàng mới từ giỏ hàng
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, note } = req.body;

    // Kiểm tra giỏ hàng
    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists || Cart.fromFirestore(cartDoc).items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Giỏ hàng trống",
      });
    }

    const cart = Cart.fromFirestore(cartDoc);

    // Kiểm tra tồn kho
    const inventoryChecks = await Promise.all(
      cart.items.map(async (item) => {
        const inventoryDoc = await db
          .collection("inventory")
          .doc(item.productId)
          .get();
        if (!inventoryDoc.exists) return false;
        const inventory = Inventory.fromFirestore(inventoryDoc);
        return inventory.canExport(item.quantity);
      })
    );

    if (inventoryChecks.includes(false)) {
      return res.status(400).json({
        success: false,
        error: "Một số sản phẩm không đủ số lượng trong kho",
      });
    }

    // Tính phí vận chuyển (có thể tích hợp API vận chuyển ở đây)
    const shippingFee = 30000; // Tạm thời fix cứng

    // Tạo đơn hàng
    const order = new Order({
      userId,
      items: cart.items,
      shippingAddress,
      shippingFee,
      paymentMethod,
      note,
    });
    order.calculateTotal();

    // Lưu đơn hàng
    const orderRef = await db.collection("orders").add(order.toFirestore());

    // Cập nhật tồn kho
    await Promise.all(
      order.items.map(async (item) => {
        const inventoryRef = db.collection("inventory").doc(item.productId);
        const inventoryDoc = await inventoryRef.get();
        const inventory = Inventory.fromFirestore(inventoryDoc);
        inventory.updateStock(item.quantity, "export");
        await inventoryRef.set(inventory.toFirestore());
      })
    );

    // Xóa giỏ hàng
    cart.clear();
    await cartRef.set(cart.toFirestore());

    // Lấy đơn hàng vừa tạo
    const newOrder = await orderRef.get();

    res.status(201).json({
      success: true,
      data: Order.fromFirestore(newOrder),
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Lấy danh sách đơn hàng của user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = db.collection("orders").where("userId", "==", userId);

    if (status) {
      query = query.where("status", "==", status);
    }

    const ordersSnapshot = await query.orderBy("createdAt", "desc").get();
    const orders = ordersSnapshot.docs.map((doc) => Order.fromFirestore(doc));

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error getting user orders:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Lấy chi tiết đơn hàng
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderDoc = await db.collection("orders").doc(id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đơn hàng không tồn tại",
      });
    }

    const order = Order.fromFirestore(orderDoc);

    // Kiểm tra quyền truy cập
    if (order.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Không có quyền truy cập đơn hàng này",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Cập nhật trạng thái đơn hàng (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Không có quyền thực hiện hành động này",
      });
    }

    const orderRef = db.collection("orders").doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đơn hàng không tồn tại",
      });
    }

    const order = Order.fromFirestore(orderDoc);
    order.updateStatus(status);
    await orderRef.update({ status: order.status, updatedAt: order.updatedAt });

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderRef = db.collection("orders").doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đơn hàng không tồn tại",
      });
    }

    const order = Order.fromFirestore(orderDoc);

    // Kiểm tra quyền hủy đơn
    if (order.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Không có quyền hủy đơn hàng này",
      });
    }

    // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: "Không thể hủy đơn hàng ở trạng thái này",
      });
    }

    // Cập nhật trạng thái đơn hàng
    order.updateStatus("cancelled");
    await orderRef.update({ status: order.status, updatedAt: order.updatedAt });

    // Hoàn lại tồn kho
    await Promise.all(
      order.items.map(async (item) => {
        const inventoryRef = db.collection("inventory").doc(item.productId);
        const inventoryDoc = await inventoryRef.get();
        const inventory = Inventory.fromFirestore(inventoryDoc);
        inventory.updateStock(item.quantity, "import");
        await inventoryRef.set(inventory.toFirestore());
      })
    );

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
};
