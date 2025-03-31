const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
} = require("../controllers/reviewController");

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Tạo đánh giá mới cho sản phẩm
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
 *                 type: number
 *                 description: Số sao đánh giá (1-5)
 *               comment:
 *                 type: string
 *                 description: Nội dung đánh giá
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ảnh đánh giá
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền đánh giá
 *       404:
 *         description: Đơn hàng không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/", createReview);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Lấy danh sách đánh giá của sản phẩm
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
 *           type: number
 *         description: Số trang
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Số lượng đánh giá mỗi trang
 *         default: 10
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Lọc theo số sao
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/product/:productId", getProductReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
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
 *                 type: number
 *                 description: Số sao đánh giá (1-5)
 *               comment:
 *                 type: string
 *                 description: Nội dung đánh giá
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ảnh đánh giá
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền cập nhật
 *       404:
 *         description: Đánh giá không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
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
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Đánh giá không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", deleteReview);

/**
 * @swagger
 * /api/reviews/{id}/like:
 *   post:
 *     tags: [Reviews]
 *     summary: Thêm lượt thích cho đánh giá
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
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Đánh giá không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/:id/like", likeReview);

/**
 * @swagger
 * /api/reviews/{id}/unlike:
 *   post:
 *     tags: [Reviews]
 *     summary: Bỏ lượt thích đánh giá
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
 *         description: Thành công
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Đánh giá không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/:id/unlike", unlikeReview);

module.exports = router;
