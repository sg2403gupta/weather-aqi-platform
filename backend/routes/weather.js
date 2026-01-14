const express = require("express");
const router = express.Router();
const axios = require("axios");

// LRU Cache
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

  has(key) {
    return this.cache.has(key);
  }
}

const weatherCache = new LRUCache(100);

// Get coordinates
async function getCoordinates(cityName) {
  const cacheKey = `geo_${cityName}`;
  if (weatherCache.has(cacheKey)) return weatherCache.get(cacheKey);

  const res = await axios.get(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
  );

  if (res.data.results && res.data.results.length > 0) {
    const coords = {
      lat: res.data.results[0].latitude,
      lon: res.data.results[0].longitude,
      name: res.data.results[0].name,
    };
    weatherCache.set(cacheKey, coords);
    return coords;
  }
  return null;
}

// Get weather data
router.get("/:city", async (req, res) => {
  try {
    const { city } = req.params;

    // Check cache
    const cacheKey = `weather_${city}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 600000) {
      return res.json(cached.data);
    }

    // Get coordinates
    const coords = await getCoordinates(city);
    if (!coords) {
      return res.status(404).json({ error: "City not found" });
    }

    // Fetch weather
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,pressure_msl,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,pressure_msl&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );

    const weatherData = {
      city: coords.name,
      temperature: weatherRes.data.current.temperature_2m,
      humidity: weatherRes.data.current.relative_humidity_2m,
      pressure: weatherRes.data.current.pressure_msl,
      windSpeed: weatherRes.data.current.wind_speed_10m,
      cloudCover: weatherRes.data.current.cloud_cover,
      precipitation: weatherRes.data.current.precipitation,
      hourly: weatherRes.data.hourly,
      daily: weatherRes.data.daily,
    };

    // Cache it
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

    res.json(weatherData);
  } catch (error) {
    console.error("Weather fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;
