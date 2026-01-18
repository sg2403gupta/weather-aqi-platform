const express = require("express");
const router = express.Router();
const axios = require("axios");
const { calculateTrends } = require("../utils/algorithms");

// GET /api/analytics/:city
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

    // Get daily forecast (7 days)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;

    const weatherResponse = await axios.get(weatherUrl);
    const dailyData = weatherResponse.data.daily;

    // Transform data
    const transformedData = dailyData.time.map((time, i) => ({
      date: time,
      temperature_2m_max: dailyData.temperature_2m_max[i],
      temperature_2m_min: dailyData.temperature_2m_min[i],
      precipitation_sum: dailyData.precipitation_sum[i],
      wind_speed_10m_max: dailyData.wind_speed_10m_max[i],
    }));

    // Calculate trends
    const trends = calculateTrends(transformedData);

    // Calculate additional analytics
    const totalPrecipitation = dailyData.precipitation_sum.reduce(
      (a, b) => a + b,
      0,
    );
    const avgWindSpeed =
      dailyData.wind_speed_10m_max.reduce((a, b) => a + b, 0) /
      dailyData.wind_speed_10m_max.length;

    const analytics = {
      city: cityName,
      period: {
        start: dailyData.time[0],
        end: dailyData.time[dailyData.time.length - 1],
      },
      temperature: {
        max: trends.maxTemp,
        min: trends.minTemp,
        average: trends.avgTemp,
        hottestDay: trends.hottestDay,
        coldestDay: trends.coldestDay,
      },
      precipitation: {
        total: totalPrecipitation,
        average: totalPrecipitation / dailyData.time.length,
        rainyDays: dailyData.precipitation_sum.filter((p) => p > 0).length,
      },
      wind: {
        averageMaxSpeed: avgWindSpeed,
        maxSpeed: Math.max(...dailyData.wind_speed_10m_max),
      },
      generatedAt: new Date().toISOString(),
    };

    res.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error.message);
    next(error);
  }
});

module.exports = router;
