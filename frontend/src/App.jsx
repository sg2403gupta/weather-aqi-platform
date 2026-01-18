import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { LRUCache } from "./utils/dataStructures";
import {
  predictRain,
  categorizeAQI,
  generateAlerts,
  calculateTrends,
} from "./utils/algorithms";
import Header from "./components/Header";
import AlertsPanel from "./components/AlertsPanel";
import NavigationTabs from "./components/NavigationTabs";
import OverviewTab from "./components/OverviewTab";
import ForecastTab from "./components/ForecastTab";
import AnalyticsTab from "./components/AnalyticsTab";
import Footer from "./components/Footer";

// Initialize cache
const apiCache = new LRUCache(50);

const WeatherAQIPlatform = () => {
  const [city, setCity] = useState("London");
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [rainPrediction, setRainPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);

  // Get API URL from environment or use default
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Geocoding with caching
  const getCoordinates = async (cityName) => {
    const cacheKey = `geo_${cityName}`;
    if (apiCache.has(cacheKey)) return apiCache.get(cacheKey);

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`,
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const coords = {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name,
      };
      apiCache.set(cacheKey, coords);
      return coords;
    }
    return null;
  };

  // Fetch weather data
  const fetchWeatherData = useCallback(async (coords) => {
    const cacheKey = `weather_${coords.lat}_${coords.lon}`;
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 600000) return cached.data;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,pressure_msl,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,pressure_msl&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();

    const result = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      cloudCover: data.current.cloud_cover,
      pressure: data.current.pressure_msl,
      windSpeed: data.current.wind_speed_10m,
      hourly: data.hourly.time.slice(0, 48).map((time, i) => ({
        time: new Date(time).toLocaleTimeString("en-US", { hour: "2-digit" }),
        temperature: data.hourly.temperature_2m[i],
        humidity: data.hourly.relative_humidity_2m[i],
        precipitation: data.hourly.precipitation_probability[i],
        cloudcover: data.hourly.cloud_cover[i],
        pressure: data.hourly.pressure_msl[i],
      })),
      daily: data.daily.time.map((time, i) => ({
        date: new Date(time).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        maxTemp: data.daily.temperature_2m_max[i],
        minTemp: data.daily.temperature_2m_min[i],
        precipitation: data.daily.precipitation_sum[i],
      })),
    };

    apiCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }, []);

  // Simulated AQI
  const fetchAQI = useCallback(async (coords) => {
    const cacheKey = `aqi_${coords.lat}_${coords.lon}`;
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 900000) return cached.data;

    const baseAQI = Math.floor(Math.random() * 150) + 20;
    const result = {
      aqi: baseAQI,
      pm25: Math.floor(baseAQI * 0.4),
      pm10: Math.floor(baseAQI * 0.6),
      category: categorizeAQI(baseAQI),
    };

    apiCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }, []);

  // Main data fetch function
  const fetchData = useCallback(
    async (cityName) => {
      setLoading(true);
      setError(null);
      try {
        const coords = await getCoordinates(cityName);
        if (!coords) {
          setError("City not found. Please try another city.");
          setLoading(false);
          return;
        }

        const [weatherData, aqiData] = await Promise.all([
          fetchWeatherData(coords),
          fetchAQI(coords),
        ]);

        setWeather(weatherData);
        setForecast(weatherData.daily);
        setAqi(aqiData.aqi);

        const prediction = predictRain(weatherData.hourly);
        setRainPrediction(prediction);

        const alertList = generateAlerts(weatherData, aqiData.aqi, prediction);
        setAlerts(alertList);

        const trendData = calculateTrends(
          weatherData.daily.map((d) => ({ temperature: d.maxTemp })),
        );
        setTrends(trendData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading data. Please try again.");
      }
      setLoading(false);
    },
    [fetchWeatherData, fetchAQI],
  );

  useEffect(() => {
    fetchData(city);
  }, [city, fetchData]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput("");
    }
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-300 text-lg">
            Loading weather data...
          </p>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white dark:text-white mb-2">
            Oops!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              fetchData("London");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <Header
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />

        {alerts.length > 0 && <AlertsPanel alerts={alerts} />}

        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "overview" && weather && weather.hourly && (
          <OverviewTab
            weather={weather}
            city={city}
            aqi={aqi}
            rainPrediction={rainPrediction}
          />
        )}

        {activeTab === "forecast" &&
          weather &&
          weather.hourly &&
          forecast.length > 0 && (
            <ForecastTab forecast={forecast} weather={weather} />
          )}

        {activeTab === "analytics" && trends && (
          <AnalyticsTab trends={trends} forecast={forecast} />
        )}

        <Footer />
      </div>
    </div>
  );
};

export default WeatherAQIPlatform;
