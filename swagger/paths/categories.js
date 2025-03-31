/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Quản lý danh mục
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Thêm danh mục mới
 *     tags: [Categories]
 *     description: API thêm danh mục vào Firestore.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Danh mục được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: string
 *                   example: "abc123"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *   get:
 *     summary: Lấy danh sách danh mục
 *     tags: [Categories]
 *     description: API lấy toàn bộ danh mục từ Firestore.
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [Categories]
 *     description: API cập nhật thông tin danh mục theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tên danh mục mới"
 *               description:
 *                 type: string
 *                 example: "Mô tả mới cho danh mục"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Danh mục đã được cập nhật"
 *       404:
 *         description: Không tìm thấy danh mục
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Categories]
 *     description: API xóa danh mục theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Danh mục đã được xóa"
 *       404:
 *         description: Không tìm thấy danh mục
 */

module.exports = {};
