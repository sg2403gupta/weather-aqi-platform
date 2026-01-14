const mongoose = require("mongoose");

const pollutantSchema = new mongoose.Schema(
  {
    pm25: Number,
    pm10: Number,
    no2: Number,
    o3: Number,
    co: Number,
    so2: Number,
  },
  { _id: false }
);

const aqiSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },

  aqi: { type: Number, required: true },
  category: String, // e.g. Good, Moderate, Poor, Severe
  dominantPollutant: String, // e.g. pm25, pm10, no2

  pollutants: pollutantSchema, // structured pollutant values

  source: { type: String }, // API or station name (optional)

  timestamp: { type: Date, default: Date.now, index: true },
});

// Optimized compound index for time-based queries
aqiSchema.index({ city: 1, timestamp: -1 });

module.exports = mongoose.model("AQI", aqiSchema);
