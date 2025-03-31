/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *         - country
 *       properties:
 *         id:
 *           type: string
 *           description: ID tự động được tạo bởi Firestore (không cần gửi khi tạo mới)
 *           readOnly: true
 *         name:
 *           type: string
 *           description: Tên nhãn hàng
 *         country:
 *           type: string
 *           description: Quốc gia xuất xứ
 *         logo:
 *           type: string
 *           description: URL hình ảnh logo của nhãn hàng
 *         description:
 *           type: string
 *           description: Mô tả chi tiết về nhãn hàng
 *         website:
 *           type: string
 *           description: Website chính thức của nhãn hàng
 *         foundedYear:
 *           type: integer
 *           description: Năm thành lập
 *       example:
 *         name: "Apple"
 *         country: "Hoa Kỳ"
 *         logo: "https://example.com/logos/apple.png"
 *         description: "Công ty công nghệ đa quốc gia của Mỹ"
 *         website: "https://www.apple.com"
 *         foundedYear: 1976
 *     BrandResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Brand'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "abc123"
 */

module.exports = {};
