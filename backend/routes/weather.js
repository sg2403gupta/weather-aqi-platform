const express = require("express");
const router = express.Router();
const axios = require("axios");
const LRUCache = require("../utils/cache");
const Weather = require("../models/Weather");

// Initialize cache (100 entries)
const weatherCache = new LRUCache(100);

// Helper: Get coordinates from city name
async function getCoordinates(cityName) {
  const cacheKey = `geo_${cityName.toLowerCase()}`;

  if (weatherCache.has(cacheKey)) {
    return weatherCache.get(cacheKey);
  }

  try {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`,
    );

    if (response.data.results && response.data.results.length > 0) {
      const coords = {
        latitude: response.data.results[0].latitude,
        longitude: response.data.results[0].longitude,
        name: response.data.results[0].name,
      };

      weatherCache.set(cacheKey, coords);
      return coords;
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw new Error("Failed to geocode city");
  }
}

// GET /api/weather/:city
router.get("/:city", async (req, res, next) => {
  try {
    const cityName = req.params.city;
    const cacheKey = `weather_${cityName.toLowerCase()}`;

    // Check cache (10 minute TTL)
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 600000) {
      return res.json({
        ...cached.data,
        source: "cache",
        cachedAt: new Date(cached.timestamp).toISOString(),
      });
    }

    // Get coordinates
    const coords = await getCoordinates(cityName);
    if (!coords) {
      return res.status(404).json({
        error: "City not found",
        city: cityName,
      });
    }

    // Fetch weather data from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,pressure_msl,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,pressure_msl&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const weatherResponse = await axios.get(weatherUrl);
    const data = weatherResponse.data;

    // Structure the response
    const weatherData = {
      city: coords.name,
      coordinates: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        cloudCover: data.current.cloud_cover,
        pressure: data.current.pressure_msl,
        windSpeed: data.current.wind_speed_10m,
        time: data.current.time,
      },
      hourly: {
        time: data.hourly.time.slice(0, 48),
        temperature_2m: data.hourly.temperature_2m.slice(0, 48),
        relative_humidity_2m: data.hourly.relative_humidity_2m.slice(0, 48),
        precipitation_probability: data.hourly.precipitation_probability.slice(
          0,
          48,
        ),
        cloud_cover: data.hourly.cloud_cover.slice(0, 48),
        pressure_msl: data.hourly.pressure_msl.slice(0, 48),
      },
      daily: {
        time: data.daily.time,
        temperature_2m_max: data.daily.temperature_2m_max,
        temperature_2m_min: data.daily.temperature_2m_min,
        precipitation_sum: data.daily.precipitation_sum,
      },
      source: "api",
      fetchedAt: new Date().toISOString(),
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now(),
    });

    // Save to database if connected
    if (Weather && Weather.db && Weather.db.readyState === 1) {
      try {
        await Weather.create({
          city: coords.name,
          coordinates: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          pressure: data.current.pressure_msl,
          windSpeed: data.current.wind_speed_10m,
          cloudCover: data.current.cloud_cover,
          precipitation: data.current.precipitation,
        });
      } catch (dbError) {
        console.error("Database save error:", dbError.message);
        // Don't fail the request if DB save fails
      }
    }

    res.json(weatherData);
  } catch (error) {
    console.error("Weather fetch error:", error.message);
    next(error);
  }
});

// GET /api/weather/cache/stats
router.get("/cache/stats", (req, res) => {
  res.json({
    cacheSize: weatherCache.size(),
    cacheCapacity: weatherCache.capacity,
    cacheUtilization: `${((weatherCache.size() / weatherCache.capacity) * 100).toFixed(2)}%`,
  });
});

module.exports = router;
