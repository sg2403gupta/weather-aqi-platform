const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allowed frontend origins (exact match only)
const allowedOrigins = [
  "https://weather-aqi-platform.vercel.app",
  "http://localhost:5173",
];

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Weather AQI API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// MongoDB Connection (optional)
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Error:", err));
}

// Routes
app.use("/api/weather", require("./routes/weather"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
