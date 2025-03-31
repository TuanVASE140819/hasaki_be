const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Lấy giỏ hàng của người dùng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */
router.get("/", getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     tags: [Cart]
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
 *                 type: number
 *                 description: Số lượng
 *                 default: 1
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Số lượng không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Sản phẩm không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/", addToCart);

/**
 * @swagger
 * /api/cart:
 *   put:
 *     tags: [Cart]
 *     summary: Cập nhật số lượng sản phẩm trong giỏ
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
 *                 type: number
 *                 description: Số lượng mới
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Số lượng không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy giỏ hàng hoặc sản phẩm
 *       500:
 *         description: Lỗi server
 */
router.put("/", updateCartItem);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy giỏ hàng
 *       500:
 *         description: Lỗi server
 */
router.delete("/:productId", removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     tags: [Cart]
 *     summary: Xóa toàn bộ giỏ hàng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy giỏ hàng
 *       500:
 *         description: Lỗi server
 */
router.delete("/clear", clearCart);

module.exports = router;
