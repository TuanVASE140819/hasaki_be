# Hasaki Backend API

Backend API cho ứng dụng Hasaki E-commerce sử dụng Node.js, Express và Firebase.

## Cài đặt

```bash
# Clone repository
git clone https://github.com/your-username/hasaki_be.git

# Di chuyển vào thư mục project
cd hasaki_be

# Cài đặt dependencies
npm install

# Tạo file .env và cấu hình các biến môi trường
cp .env.example .env

# Khởi động server
npm start
```

## Cấu hình môi trường

Tạo file `.env` với các biến môi trường sau:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key

# Firebase config
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## API Documentation

API documentation có sẵn tại `/api-docs` sau khi khởi động server.

## Tính năng

- [x] Xác thực người dùng (Đăng ký, Đăng nhập)
- [x] Quản lý danh mục
- [ ] Quản lý sản phẩm
- [ ] Quản lý giỏ hàng
- [ ] Quản lý đơn hàng
- [ ] Đánh giá sản phẩm

## Các API Endpoints

### Users

- GET `/api/users`: Lấy danh sách users
- GET `/api/users/:id`: Lấy thông tin user theo ID
- POST `/api/users`: Tạo user mới
- PUT `/api/users/:id`: Cập nhật thông tin user
- DELETE `/api/users/:id`: Xóa user

## Công nghệ sử dụng

- Node.js
- Express
- Firebase Admin SDK
- Swagger UI
- CORS
