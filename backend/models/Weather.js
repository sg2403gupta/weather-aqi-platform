const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  temperature: Number,
  humidity: Number,
  pressure: Number,
  windSpeed: Number,
  cloudCover: Number,
  precipitation: Number,
  timestamp: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("Weather", weatherSchema);
