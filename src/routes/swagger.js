const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hasaki API Documentation",
      version: "1.0.0",
      description: "API documentation for Hasaki e-commerce platform",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.hasaki.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "Public",
        description: "API công khai, không cần xác thực",
      },
      {
        name: "User",
        description: "API dành cho người dùng đã đăng nhập",
      },
      {
        name: "Admin",
        description: "API dành cho quản trị viên",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js", "./src/controllers/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
