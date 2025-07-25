const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve uploaded images with CORS and static path
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Debug: View uploaded files list (for development only)
app.get("/debug/uploads", (req, res) => {
  const fs = require("fs");
  const uploadsPath = path.join(__dirname, "/uploads");

  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({
      uploadsPath,
      files,
      filesCount: files.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug: Check if specific file exists (for development only)
app.get("/debug/file/:filename", (req, res) => {
  const fs = require("fs");
  const filePath = path.join(__dirname, "/uploads", req.params.filename);

  res.json({
    filename: req.params.filename,
    filePath,
    exists: fs.existsSync(filePath),
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/calendar", require("./routes/calendarRoutes"));

// Swagger Documentation
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Umoja API",
      version: "1.0.0",
      description: "API documentation for the Umoja application",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root route
app.get("/", (req, res) => res.send("✅ Umoja API is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
