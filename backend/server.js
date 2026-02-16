const express = require("express");
const cors = require("cors");
const idempotencyMiddleware = require("./middleware/idempotency");
const expensesRouter = require("./routes/expenses");
const { cleanupIdempotencyKeys } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-frontend-url.onrender.com", // Update this after deploying frontend
    /\.onrender\.com$/, // Allow all Render preview deployments
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Idempotency-Key"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(idempotencyMiddleware);

// Routes
app.use("/expenses", expensesRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Clean up old idempotency keys every hour
setInterval(
  () => {
    cleanupIdempotencyKeys();
  },
  60 * 60 * 1000,
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
