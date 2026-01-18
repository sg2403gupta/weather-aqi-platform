const mongoose = require("mongoose");

const aqiSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      index: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    aqi: {
      type: Number,
      required: true,
    },
    pm25: Number,
    pm10: Number,
    co: Number,
    no2: Number,
    o3: Number,
    so2: Number,
    category: {
      type: String,
      enum: [
        "Good",
        "Moderate",
        "Unhealthy for Sensitive",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous",
      ],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index
aqiSchema.index({ city: 1, timestamp: -1 });

// TTL index - delete after 7 days
aqiSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model("AQI", aqiSchema);
