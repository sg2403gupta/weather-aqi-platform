const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema(
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
    temperature: Number,
    humidity: Number,
    pressure: Number,
    windSpeed: Number,
    cloudCover: Number,
    precipitation: Number,
    hourlyData: [
      {
        time: Date,
        temperature: Number,
        humidity: Number,
        precipitation: Number,
      },
    ],
    dailyData: [
      {
        date: Date,
        maxTemp: Number,
        minTemp: Number,
        precipitation: Number,
      },
    ],
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

// Create compound index for efficient queries
weatherSchema.index({ city: 1, timestamp: -1 });

// TTL index - automatically delete documents older than 7 days
weatherSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model("Weather", weatherSchema);
