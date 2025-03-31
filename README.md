# Hasaki Backend API

Backend API sử dụng Node.js, Express, Firebase và Swagger.

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/TuanVASE140819/hasaki_be.git
cd hasaki_be
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` và cập nhật các biến môi trường:

```env
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/serviceAccountKey.json
FIREBASE_PROJECT_ID=hasaki-ebfd2
```

4. Chạy server:

```bash
npm run dev
```

## API Documentation

Swagger UI có sẵn tại: `http://localhost:3000/api-docs`

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
