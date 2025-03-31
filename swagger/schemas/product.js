/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - image
 *         - price
 *         - categories
 *       properties:
 *         id:
 *           type: string
 *           description: ID tự động được tạo bởi Firestore
 *         name:
 *           type: string
 *           description: Tên sản phẩm
 *         image:
 *           type: string
 *           description: URL hình ảnh sản phẩm
 *         price:
 *           type: number
 *           description: Giá sản phẩm
 *         priceRange:
 *           type: string
 *           description: Giá dao động
 *         duration:
 *           type: string
 *           description: Thời hạn (3 tháng, 6 tháng, 12 tháng)
 *         subscriptionPlan:
 *           type: string
 *           description: Gói đăng ký
 *         purchased:
 *           type: integer
 *           description: Số lượng đã mua
 *         reviewCount:
 *           type: integer
 *           description: Số lượng đánh giá từ khách hàng
 *         salesCount:
 *           type: integer
 *           description: Số lượt bán
 *         warranty:
 *           type: string
 *           description: Chính sách bảo hành
 *         rating:
 *           type: number
 *           description: Đánh giá sản phẩm (từ 0-5)
 *         shortDescription:
 *           type: string
 *           description: Mô tả ngắn gọn
 *         productDetails:
 *           type: string
 *           description: Thông tin chi tiết sản phẩm
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách ID danh mục
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời điểm tạo sản phẩm
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời điểm cập nhật sản phẩm cuối cùng
 *       example:
 *         id: "xyz789"
 *         name: "iPhone 15 Pro"
 *         image: "https://example.com/images/iphone15.jpg"
 *         price: 999.99
 *         warranty: "12 tháng chính hãng"
 *         rating: 4.5
 *         shortDescription: "Điện thoại cao cấp mới nhất từ Apple"
 *         categories: ["l7HykHTwdoykZgI8eIjv"]
 */

module.exports = {};
