const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();
const bodyParser = require("body-parser");
const { db, collection, getDocs } = require("./config/firebaseConfig");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hasaki API Documentation",
      version: "1.0.0",
      description: "API documentation for Hasaki E-commerce",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Nhập JWT token của bạn vào đây",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Hasaki API" });
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    // Test read from users collection
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);

    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      success: true,
      message: "Kết nối database thành công",
      data: {
        totalUsers: users.length,
        users: users,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server with port-finding logic
const startServer = (port) => {
  const server = app
    .listen(port, () => {
      console.log(`Server đang chạy trên cổng ${port}`);
      console.log(`API Documentation: http://localhost:${port}/api-docs`);
      console.log(`Test Database: http://localhost:${port}/test-db`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Cổng ${port} đang được sử dụng, thử với cổng ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
};

// Try to start on port 3000
const PORT = parseInt(process.env.PORT || "3000");
startServer(PORT);
