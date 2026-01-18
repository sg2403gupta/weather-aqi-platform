// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Weather AQI API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      weather: "/api/weather/:city",
      aqi: "/api/aqi/:city",
      predictions: "/api/predictions/:city",
      analytics: "/api/analytics/:city",
    },
  });
});

// MongoDB Connection (optional for MVP)
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));
} else {
  console.log("⚠️  MongoDB not configured - running without database");
}

// Import routes
const weatherRoutes = require("./routes/weather");
const aqiRoutes = require("./routes/aqi");
const predictionsRoutes = require("./routes/predictions");
const analyticsRoutes = require("./routes/analytics");

// Use routes
app.use("/api/weather", weatherRoutes);
app.use("/api/aqi", aqiRoutes);
app.use("/api/predictions", predictionsRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🌐 CORS enabled for: ${process.env.FRONTEND_URL || "all origins"}`,
  );
});
