const express = require("express");
const router = express.Router();
const axios = require("axios");
const { predictRain } = require("../utils/algorithms");
const Prediction = require("../models/Prediction");

// GET /api/predictions/:city
router.get("/:city", async (req, res, next) => {
  try {
    const cityName = req.params.city;

    // Get coordinates
    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`,
    );

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude } = geoResponse.data.results[0];

    // Get hourly forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,pressure_msl&timezone=auto`;

    const weatherResponse = await axios.get(weatherUrl);
    const hourlyData = weatherResponse.data.hourly;

    // Transform data for prediction algorithm
    const transformedData = hourlyData.time.map((time, i) => ({
      time,
      temperature_2m: hourlyData.temperature_2m[i],
      relative_humidity_2m: hourlyData.relative_humidity_2m[i],
      precipitation_probability: hourlyData.precipitation_probability[i],
      cloud_cover: hourlyData.cloud_cover[i],
      pressure_msl: hourlyData.pressure_msl[i],
    }));

    // Run prediction algorithm
    const prediction = predictRain(transformedData);

    const result = {
      city: cityName,
      rainProbability: prediction.probability,
      factors: prediction.factors,
      confidence: prediction.confidence,
      predictedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Save to database if connected
    if (Prediction && Prediction.db && Prediction.db.readyState === 1) {
      try {
        await Prediction.create({
          city: cityName,
          rainProbability: prediction.probability,
          factors: prediction.factors,
          confidence: prediction.confidence,
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
      } catch (dbError) {
        console.error("Database save error:", dbError.message);
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Prediction error:", error.message);
    next(error);
  }
});

module.exports = router;
