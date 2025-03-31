const express = require("express");
const router = express.Router();
const { db } = require("../config/firebaseConfig");
const {
  createProduct,
  getProductsByCategory,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Tạo sản phẩm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *               price:
 *                 type: number
 *                 description: Giá sản phẩm
 *               categoryId:
 *                 type: string
 *                 description: ID danh mục
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách URL hình ảnh
 *               brand:
 *                 type: string
 *                 description: Thương hiệu
 *               stock:
 *                 type: number
 *                 description: Số lượng tồn kho
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       404:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/", createProduct);

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy danh sách sản phẩm theo danh mục
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.get("/category/:categoryId", getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy chi tiết sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Sản phẩm không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Cập nhật sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               brand:
 *                 type: string
 *               stock:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Sản phẩm hoặc danh mục không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Xóa sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Sản phẩm không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", deleteProduct);

module.exports = router;
