const mongoose = require("mongoose");

const aqiSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  aqi: Number,
  pm25: Number,
  pm10: Number,
  category: String,
  timestamp: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("AQI", aqiSchema);
