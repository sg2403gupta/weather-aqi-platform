const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      index: true,
    },
    rainProbability: {
      type: Number,
      min: 0,
      max: 100,
    },
    factors: [String],
    confidence: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    predictedAt: {
      type: Date,
      default: Date.now,
    },
    validUntil: Date,
  },
  {
    timestamps: true,
  },
);

// TTL index - delete after 1 day
predictionSchema.index({ predictedAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Prediction", predictionSchema);
