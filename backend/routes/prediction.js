const express = require("express");
const router = express.Router();
const Weather = require("../models/Weather");
const axios = require("axios");

// LRU Cache implementation
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

const weatherCache = new LRUCache(100);

// Get weather data
router.get("/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const cityKey = city.toLowerCase().trim();

    // Check cache
    const cacheKey = `weather_${cityKey}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 600000) {
      return res.json(cached.data);
    }

    // Check database (last 10 minutes)
    const dbData = await Weather.findOne({
      city: cityKey,
      timestamp: { $gte: new Date(Date.now() - 600000) },
    }).sort({ timestamp: -1 });

    if (dbData) {
      weatherCache.set(cacheKey, { data: dbData, timestamp: Date.now() });
      return res.json(dbData);
    }

    // Fetch coordinates
    const geoRes = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityKey}&count=1`
    );

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude, name } = geoRes.data.results[0];

    // Fetch weather
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params: {
          latitude,
          longitude,
          current:
            "temperature_2m,relative_humidity_2m,precipitation,cloud_cover,pressure_msl,wind_speed_10m",
          hourly:
            "temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,pressure_msl",
          daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
          timezone: "auto",
        },
        timeout: 8000,
      }
    );

    const current = weatherRes.data.current;
    if (!current) {
      return res.status(502).json({ error: "Invalid weather API response" });
    }

    const hourlyRaw = weatherRes.data.hourly;
    if (!hourlyRaw?.time?.length) {
      return res.status(502).json({ error: "Hourly weather data missing" });
    }

    // Normalize hourly data into array
    const hourly = hourlyRaw.time.map((time, i) => ({
      time,
      temperature: hourlyRaw.temperature_2m[i],
      humidity: hourlyRaw.relative_humidity_2m[i],
      precipitationProbability: hourlyRaw.precipitation_probability[i],
      cloudCover: hourlyRaw.cloud_cover[i],
      pressure: hourlyRaw.pressure_msl[i],
    }));

    const weatherData = {
      city: name.toLowerCase(),
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
      windSpeed: current.wind_speed_10m,
      cloudCover: current.cloud_cover,
      precipitation: current.precipitation,
      hourly, // ARRAY (frontend safe)
      daily: weatherRes.data.daily,
      timestamp: new Date(),
    };

    // Save to database
    const weather = new Weather(weatherData);
    await weather.save();

    // Cache it
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

    res.json(weatherData);
  } catch (error) {
    console.error(
      "Weather fetch error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message,
    });
  }
});

module.exports = router;
