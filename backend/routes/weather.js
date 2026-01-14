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
    const cityKey = city.toLowerCase().trim();

    // Cache check
    const cacheKey = `weather_${cityKey}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 600000) {
      return res.json(cached.data);
    }

    // Get coordinates
    const coords = await getCoordinates(cityKey);
    if (!coords) {
      return res.status(404).json({ error: "City not found" });
    }

    // Fetch weather
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params: {
          latitude: coords.lat,
          longitude: coords.lon,
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

    // Normalize hourly data into array (SAFE)
    const hourlyRaw = weatherRes.data.hourly;

    if (!hourlyRaw?.time?.length) {
      return res.status(502).json({ error: "Hourly weather data missing" });
    }

    const hourly = hourlyRaw.time.map((time, i) => ({
      time,
      temperature: hourlyRaw.temperature_2m?.[i],
      humidity: hourlyRaw.relative_humidity_2m?.[i],
      precipitationProbability: hourlyRaw.precipitation_probability?.[i],
      cloudCover: hourlyRaw.cloud_cover?.[i],
      pressure: hourlyRaw.pressure_msl?.[i],
    }));

    const weatherData = {
      city: coords.name,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
      windSpeed: current.wind_speed_10m,
      cloudCover: current.cloud_cover,
      precipitation: current.precipitation,
      hourly, // ARRAY for frontend .map()
      daily: weatherRes.data.daily,
    };

    // Cache result
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
