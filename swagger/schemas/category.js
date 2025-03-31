/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: ID tự động được tạo bởi Firestore (không cần gửi khi tạo mới)
 *           readOnly: true
 *         name:
 *           type: string
 *           description: Tên danh mục
 *         description:
 *           type: string
 *           description: Mô tả chi tiết về danh mục
 *       example:
 *         name: "Điện thoại"
 *         description: "Danh mục các sản phẩm điện thoại di động"
 *     CategoryResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "abc123"
 */

module.exports = {};
