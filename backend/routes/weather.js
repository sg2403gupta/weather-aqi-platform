const express = require("express");
const router = express.Router();
const axios = require("axios");

// ---------------- LRU CACHE ----------------
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

// ---------------- GEO CODING ----------------
async function getCoordinates(cityName) {
  const cacheKey = `geo_${cityName}`;
  if (weatherCache.has(cacheKey)) return weatherCache.get(cacheKey);

  const res = await axios.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      params: { name: cityName, count: 1 },
      timeout: 5000,
    },
  );

  if (res.data?.results?.length > 0) {
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

// ---------------- WEATHER ROUTE ----------------
router.get("/:city", async (req, res) => {
  try {
    const cityKey = req.params.city.toLowerCase().trim();
    const cacheKey = `weather_${cityKey}`;

    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 600000) {
      return res.json(cached.data);
    }

    const coords = await getCoordinates(cityKey);
    if (!coords) {
      return res.status(404).json({
        temperature: null,
        hourly: [],
        daily: [],
        message: "City not found",
      });
    }

    const weatherRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
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
        timeout: 12000,
      },
    );

    const current = weatherRes.data?.current;

    const hourlyRaw = weatherRes.data?.hourly;
    const dailyRaw = weatherRes.data?.daily;

    const hourly = Array.isArray(hourlyRaw?.time)
      ? hourlyRaw.time.map((time, i) => ({
          time,
          temperature: hourlyRaw.temperature_2m?.[i],
          humidity: hourlyRaw.relative_humidity_2m?.[i],
          precipitationProbability: hourlyRaw.precipitation_probability?.[i],
          cloudCover: hourlyRaw.cloud_cover?.[i],
          pressure: hourlyRaw.pressure_msl?.[i],
        }))
      : [];

    const daily = Array.isArray(dailyRaw?.time)
      ? dailyRaw.time.map((date, i) => ({
          date,
          maxTemp: dailyRaw.temperature_2m_max?.[i],
          minTemp: dailyRaw.temperature_2m_min?.[i],
          precipitation: dailyRaw.precipitation_sum?.[i],
        }))
      : [];

    const weatherData = {
      city: coords.name,
      temperature: current?.temperature_2m ?? null,
      humidity: current?.relative_humidity_2m ?? null,
      pressure: current?.pressure_msl ?? null,
      windSpeed: current?.wind_speed_10m ?? null,
      cloudCover: current?.cloud_cover ?? null,
      precipitation: current?.precipitation ?? null,
      hourly,
      daily,
    };

    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now(),
    });

    res.json(weatherData);
  } catch (error) {
    console.error(
      "Weather fetch error:",
      error.response?.data || error.message,
    );

    res.status(200).json({
      temperature: null,
      hourly: [],
      daily: [],
      message: "Weather service unavailable",
    });
  }
});

module.exports = router;
