const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { authenticateToken, optionalAuth } = require("./middleware/auth");
const onboardingRoutes = require("./routes/onboarding");
const profileRoutes = require("./routes/profile");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(
  cors({
    origin: process.env.NEXT_APP_URL || "http://localhost:3000",
    credentials: true, // Forward cookies Better Auth
  })
);
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Selamat! API CUAN SELOR berhasil menyala.",
    status: "Active",
  });
});

// ── App Routes ─────────────────────────────────────────
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/profile", profileRoutes);

// Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected endpoint",
    user: req.user,
  });
});

// Optional auth route
app.get("/api/public-with-user-info", optionalAuth, (req, res) => {
  res.json({
    message: "This endpoint works with or without auth",
    user: req.user || null,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Menyalakan server
app.listen(PORT, () => {
  console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
  console.log(`📝 Onboarding routes: POST /api/onboarding/financial, POST /api/onboarding/pension`);
});
