require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

// Kiểm tra các biến môi trường bắt buộc
const requiredEnvs = ["JWT_SECRET", "FIREBASE_API_KEY", "FIREBASE_PROJECT_ID"];
for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`Error: ${env} is required`);
    process.exit(1);
  }
}

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log("Các routes có sẵn:");
  console.log("- POST /api/auth/register");
  console.log("- POST /api/auth/login");
});
