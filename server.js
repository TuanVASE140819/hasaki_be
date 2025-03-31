require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger"); // Updated path to use the new swagger structure
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const authRoutes = require("./routes/authenticationRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Add this line
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const db = require("./config/firebaseConfig");
    const result = await db.collection("test").add({
      testField: true,
      timestamp: new Date(),
    });
    res.json({
      success: true,
      id: result.id,
      message: "Database connection working!",
    });
  } catch (error) {
    console.error("Database Test Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
});

// Routes
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/brands", brandRoutes);
app.use("/cart", cartRoutes); // Add this line
app.use("/orders", orderRoutes);

// Start server with port-finding logic
const startServer = (port) => {
  const server = app
    .listen(port, () => console.log(`Server đang chạy trên cổng ${port}`))
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} đang được sử dụng, thử với cổng ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error("Server error:", err);
      }
    });
};

// Try to start on default port, then increment if needed
const PORT = parseInt(process.env.PORT || "5010");
startServer(PORT);
