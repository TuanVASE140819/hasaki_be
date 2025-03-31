const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Firestore API",
      version: "1.0.0",
      description: "API sử dụng Firestore làm database",
      contact: {
        name: "Developer",
        email: "developer@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5010",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./swagger/schemas/*.js", "./swagger/paths/*.js"], // Load all schemas and paths
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
