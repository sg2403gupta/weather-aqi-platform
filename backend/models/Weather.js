const mongoose = require("mongoose");

const hourlySchema = new mongoose.Schema(
  {
    time: String,
    temperature: Number,
    humidity: Number,
    precipitationProbability: Number,
    cloudCover: Number,
    pressure: Number,
  },
  { _id: false }
);

const dailySchema = new mongoose.Schema(
  {
    time: [String],
    temperature_2m_max: [Number],
    temperature_2m_min: [Number],
    precipitation_sum: [Number],
  },
  { _id: false }
);

const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },

  temperature: Number,
  humidity: Number,
  pressure: Number,
  windSpeed: Number,
  cloudCover: Number,
  precipitation: Number,

  hourly: [hourlySchema], // ARRAY for frontend .map()
  daily: dailySchema, // Forecast summaries

  timestamp: { type: Date, default: Date.now, index: true },
});

// Compound index for fast time-based city queries
weatherSchema.index({ city: 1, timestamp: -1 });

module.exports = mongoose.model("Weather", weatherSchema);
