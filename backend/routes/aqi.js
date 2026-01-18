const express = require("express");
const router = express.Router();
const LRUCache = require("../utils/cache");
const { categorizeAQI } = require("../utils/algorithms");
const AQI = require("../models/AQI");

// Initialize cache
const aqiCache = new LRUCache(100);

// GET /api/aqi/:city
router.get("/:city", async (req, res, next) => {
  try {
    const cityName = req.params.city;
    const cacheKey = `aqi_${cityName.toLowerCase()}`;

    // Check cache (15 minute TTL)
    const cached = aqiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 900000) {
      return res.json({
        ...cached.data,
        source: "cache",
        cachedAt: new Date(cached.timestamp).toISOString(),
      });
    }

    // Simulated AQI data (replace with OpenAQ API in production)
    const baseAQI = Math.floor(Math.random() * 150) + 20;
    const category = categorizeAQI(baseAQI);

    const aqiData = {
      city: cityName,
      aqi: baseAQI,
      pm25: Math.floor(baseAQI * 0.4),
      pm10: Math.floor(baseAQI * 0.6),
      co: Math.floor(Math.random() * 5) + 1,
      no2: Math.floor(Math.random() * 40) + 10,
      o3: Math.floor(Math.random() * 60) + 20,
      category: category.category,
      color: category.color,
      priority: category.priority,
      description: category.description,
      source: "simulated",
      timestamp: new Date().toISOString(),
    };

    // Cache it
    aqiCache.set(cacheKey, {
      data: aqiData,
      timestamp: Date.now(),
    });

    // Save to database if connected
    if (AQI && AQI.db && AQI.db.readyState === 1) {
      try {
        await AQI.create({
          city: cityName,
          aqi: baseAQI,
          pm25: aqiData.pm25,
          pm10: aqiData.pm10,
          co: aqiData.co,
          no2: aqiData.no2,
          o3: aqiData.o3,
          category: category.category,
        });
      } catch (dbError) {
        console.error("Database save error:", dbError.message);
      }
    }

    res.json(aqiData);
  } catch (error) {
    console.error("AQI fetch error:", error.message);
    next(error);
  }
});

module.exports = router;
