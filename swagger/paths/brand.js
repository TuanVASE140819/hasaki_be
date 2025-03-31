/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Quản lý nhãn hàng
 */

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Thêm nhãn hàng mới
 *     tags: [Brands]
 *     description: API thêm nhãn hàng vào Firestore.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Nhãn hàng được tạo thành công
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
 *                 message:
 *                   type: string
 *                   example: "Nhãn hàng đã được tạo thành công"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *   get:
 *     summary: Lấy danh sách nhãn hàng
 *     tags: [Brands]
 *     description: API lấy toàn bộ nhãn hàng từ Firestore.
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 */

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Lấy chi tiết nhãn hàng
 *     tags: [Brands]
 *     description: API lấy thông tin chi tiết của một nhãn hàng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhãn hàng cần lấy
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Không tìm thấy nhãn hàng
 *   put:
 *     summary: Cập nhật nhãn hàng
 *     tags: [Brands]
 *     description: API cập nhật thông tin nhãn hàng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhãn hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
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
 *                   example: "Nhãn hàng đã được cập nhật"
 *       404:
 *         description: Không tìm thấy nhãn hàng
 *   delete:
 *     summary: Xóa nhãn hàng
 *     tags: [Brands]
 *     description: API xóa nhãn hàng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhãn hàng cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhãn hàng thành công
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
 *                   example: "Nhãn hàng đã được xóa"
 *       404:
 *         description: Không tìm thấy nhãn hàng
 */

module.exports = {};
