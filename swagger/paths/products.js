/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Thêm sản phẩm mới
 *     tags: [Products]
 *     description: API thêm sản phẩm vào Firestore.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Sản phẩm đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "abc123"
 *                 message:
 *                   type: string
 *                   example: "Sản phẩm đã được thêm thành công"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu dữ liệu đầu vào"
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     description: API lấy toàn bộ sản phẩm từ Firestore.
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     description: API lấy thông tin chi tiết của một sản phẩm theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Products]
 *     description: API cập nhật thông tin sản phẩm theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   delete:
 *     summary: Xóa sản phẩm
 *     tags: [Products]
 *     description: API xóa sản phẩm theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */

/**
 * @swagger
 * /products/popular:
 *   get:
 *     summary: Lấy sản phẩm phổ biến
 *     tags: [Products]
 *     description: API lấy sản phẩm phổ biến (bán chạy) từ Firestore.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/new:
 *   get:
 *     summary: Lấy sản phẩm mới
 *     tags: [Products]
 *     description: API lấy sản phẩm mới nhất từ Firestore.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

module.exports = {};
