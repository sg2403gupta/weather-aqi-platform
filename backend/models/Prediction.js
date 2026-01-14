const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  city: { type: String, required: true, index: true },
  rainProbability: Number,
  factors: [String],
  confidence: String,
  predictedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prediction", predictionSchema);
