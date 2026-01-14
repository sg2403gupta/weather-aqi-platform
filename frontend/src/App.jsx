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

  // Geocoding with caching
  const getCoordinates = async (cityName) => {
    const cacheKey = `geo_${cityName}`;
    if (apiCache.has(cacheKey)) return apiCache.get(cacheKey);

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
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

    // Use backend API instead of direct call
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/weather/${coords.name}`);
    const data = await res.json();

    apiCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
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

  // Main data fetch
  const fetchData = useCallback(
    async (cityName) => {
      setLoading(true);
      try {
        const coords = await getCoordinates(cityName);
        if (!coords) {
          alert("City not found. Please try another city.");
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
          weatherData.daily.map((d) => ({ temperature: d.maxTemp }))
        );
        setTrends(trendData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading data. Please try again.");
      }
      setLoading(false);
    },
    [fetchWeatherData, fetchAQI]
  );

  useEffect(() => {
    fetchData(city);
  }, [city, fetchData]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setCity(searchInput.trim());
    }
  };

  // Loading state
  if (loading && !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BDE8F5] px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#4988C4] mx-auto mb-4" />
          <p className="text-[#0F2854] text-sm sm:text-base">
            Loading weather data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#BDE8F5] px-3 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />

        {/* Alerts */}
        {alerts.length > 0 && <AlertsPanel alerts={alerts} />}

        {/* Navigation */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Overview */}
        {activeTab === "overview" && weather && weather.hourly && (
          <OverviewTab
            weather={weather}
            city={city}
            aqi={aqi}
            rainPrediction={rainPrediction}
          />
        )}

        {/* Forecast */}
        {activeTab === "forecast" &&
          weather &&
          weather.hourly &&
          forecast.length > 0 && (
            <ForecastTab forecast={forecast} weather={weather} />
          )}

        {/* Analytics */}
        {activeTab === "analytics" && trends && (
          <AnalyticsTab trends={trends} forecast={forecast} />
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default WeatherAQIPlatform;
