const express = require("express");
const router = express.Router();
const { db, auth } = require("../config/firebaseConfig");
const { authenticateToken, isUser } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
} = require("../controllers/orderController");
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
} = require("../controllers/reviewController");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API dành cho người dùng đã đăng nhập
 */

/**
 * @swagger
 * /api/user/cart:
 *   get:
 *     tags: [User]
 *     summary: Lấy giỏ hàng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy giỏ hàng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/cart", authenticateToken, isUser, getCart);

/**
 * @swagger
 * /api/user/cart:
 *   post:
 *     tags: [User]
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID sản phẩm
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 description: Số lượng
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
router.post("/cart", authenticateToken, isUser, addToCart);

/**
 * @swagger
 * /api/user/cart:
 *   put:
 *     tags: [User]
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID sản phẩm
 *               quantity:
 *                 type: integer
 *                 description: Số lượng mới
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
router.put("/cart", authenticateToken, isUser, updateCartItem);

/**
 * @swagger
 * /api/user/cart/{productId}:
 *   delete:
 *     tags: [User]
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
router.delete("/cart/:productId", authenticateToken, isUser, removeFromCart);

/**
 * @swagger
 * /api/user/cart/clear:
 *   delete:
 *     tags: [User]
 *     summary: Xóa toàn bộ giỏ hàng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.delete("/cart/clear", authenticateToken, isUser, clearCart);

/**
 * @swagger
 * /api/user/orders:
 *   post:
 *     tags: [User]
 *     summary: Tạo đơn hàng mới
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - address
 *                   - city
 *                   - district
 *                   - ward
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: Địa chỉ chi tiết
 *                   city:
 *                     type: string
 *                     description: Tỉnh/Thành phố
 *                   district:
 *                     type: string
 *                     description: Quận/Huyện
 *                   ward:
 *                     type: string
 *                     description: Phường/Xã
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, bank]
 *                 description: Phương thức thanh toán
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Giỏ hàng trống
 *       500:
 *         description: Lỗi server
 */
router.post("/orders", authenticateToken, isUser, createOrder);

/**
 * @swagger
 * /api/user/orders:
 *   get:
 *     tags: [User]
 *     summary: Lấy danh sách đơn hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipping, delivered, cancelled]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/orders", authenticateToken, isUser, getUserOrders);

/**
 * @swagger
 * /api/user/orders/{id}:
 *   get:
 *     tags: [User]
 *     summary: Lấy chi tiết đơn hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */
router.get("/orders/:id", authenticateToken, isUser, getOrder);

/**
 * @swagger
 * /api/user/orders/{id}/cancel:
 *   put:
 *     tags: [User]
 *     summary: Hủy đơn hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đơn hàng
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */
router.put("/orders/:id/cancel", authenticateToken, isUser, cancelOrder);

/**
 * @swagger
 * /api/user/reviews:
 *   post:
 *     tags: [User]
 *     summary: Tạo đánh giá sản phẩm
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - orderId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID sản phẩm
 *               orderId:
 *                 type: string
 *                 description: ID đơn hàng
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Đánh giá sao
 *               comment:
 *                 type: string
 *                 description: Nội dung đánh giá
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Hình ảnh đánh giá
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy sản phẩm hoặc đơn hàng
 *       500:
 *         description: Lỗi server
 */
router.post("/reviews", authenticateToken, isUser, createReview);

/**
 * @swagger
 * /api/user/reviews/product/{productId}:
 *   get:
 *     tags: [Public]
 *     summary: Lấy danh sách đánh giá sản phẩm
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng đánh giá mỗi trang
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Lọc theo số sao
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
router.get("/reviews/product/:productId", getProductReviews);

/**
 * @swagger
 * /api/user/reviews/{id}:
 *   put:
 *     tags: [User]
 *     summary: Cập nhật đánh giá
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đánh giá
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Đánh giá sao
 *               comment:
 *                 type: string
 *                 description: Nội dung đánh giá
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Hình ảnh đánh giá
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 */
router.put("/reviews/:id", authenticateToken, isUser, updateReview);

/**
 * @swagger
 * /api/user/reviews/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Xóa đánh giá
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đánh giá
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 */
router.delete("/reviews/:id", authenticateToken, isUser, deleteReview);

/**
 * @swagger
 * /api/user/reviews/{id}/like:
 *   post:
 *     tags: [User]
 *     summary: Thích đánh giá
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đánh giá
 *     responses:
 *       200:
 *         description: Thích đánh giá thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 */
router.post("/reviews/:id/like", authenticateToken, isUser, likeReview);

/**
 * @swagger
 * /api/user/reviews/{id}/unlike:
 *   post:
 *     tags: [User]
 *     summary: Bỏ thích đánh giá
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID đánh giá
 *     responses:
 *       200:
 *         description: Bỏ thích đánh giá thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 */
router.post("/reviews/:id/unlike", authenticateToken, isUser, unlikeReview);

// Get all users
router.get("/", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { email, password, displayName, phoneNumber } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      phoneNumber,
    });

    // Create user document in Firestore
    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      phoneNumber: userRecord.phoneNumber,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").doc(userRecord.uid).set(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const { displayName, phoneNumber } = req.body;

    // Update user in Firebase Auth
    await auth.updateUser(req.params.id, {
      displayName,
      phoneNumber,
    });

    // Update user document in Firestore
    const user = {
      displayName,
      phoneNumber,
      updatedAt: new Date(),
    };

    await db.collection("users").doc(req.params.id).update(user);
    res.json({ id: req.params.id, ...user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    // Delete user from Firebase Auth
    await auth.deleteUser(req.params.id);

    // Delete user document from Firestore
    await db.collection("users").doc(req.params.id).delete();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
