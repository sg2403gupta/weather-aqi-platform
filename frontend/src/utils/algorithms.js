import { MinHeap } from "./dataStructures";

// Rain Prediction Algorithm (Sliding Window + Heuristics)
export const predictRain = (forecastData) => {
  if (!forecastData || forecastData.length === 0) {
    return { probability: 0, factors: [], confidence: "Low" };
  }

  let score = 0;
  const factors = [];

  // Sliding window - next 24 hours
  const window = forecastData.slice(0, 24);
  const avgHumidity =
    window.reduce((sum, h) => sum + (h.humidity || 0), 0) / window.length;
  const avgPressure =
    window.reduce((sum, h) => sum + (h.pressure || 0), 0) / window.length;
  const avgCloud =
    window.reduce((sum, h) => sum + (h.cloudcover || 0), 0) / window.length;

  // Heuristic rules
  if (avgHumidity > 80) {
    score += 30;
    factors.push("High humidity detected");
  }
  if (avgHumidity > 90) {
    score += 20;
    factors.push("Very high humidity");
  }
  if (avgPressure < 1010) {
    score += 25;
    factors.push("Low atmospheric pressure");
  }
  if (avgCloud > 70) {
    score += 25;
    factors.push("Heavy cloud cover");
  }

  // Check for precipitation in forecast
  const hasPrecip = window.some((h) => (h.precipitation || 0) > 50);
  if (hasPrecip) {
    score += 30;
    factors.push("Precipitation in forecast");
  }

  return {
    probability: Math.min(score, 100),
    factors,
    confidence:
      factors.length >= 3 ? "High" : factors.length >= 2 ? "Medium" : "Low",
  };
};

// AQI Categorization (Decision Tree)
export const categorizeAQI = (aqi) => {
  if (aqi <= 50)
    return {
      category: "Good",
      color: "text-green-600",
      bg: "bg-green-100",
      priority: 4,
    };
  if (aqi <= 100)
    return {
      category: "Moderate",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      priority: 3,
    };
  if (aqi <= 150)
    return {
      category: "Unhealthy for Sensitive",
      color: "text-orange-600",
      bg: "bg-orange-100",
      priority: 2,
    };
  if (aqi <= 200)
    return {
      category: "Unhealthy",
      color: "text-red-600",
      bg: "bg-red-100",
      priority: 1,
    };
  if (aqi <= 300)
    return {
      category: "Very Unhealthy",
      color: "text-purple-600",
      bg: "bg-purple-100",
      priority: 0,
    };
  return {
    category: "Hazardous",
    color: "text-red-900",
    bg: "bg-red-200",
    priority: 0,
  };
};

// Alert Generation System
export const generateAlerts = (weather, aqi, rainPrediction) => {
  const alertQueue = new MinHeap();

  if (aqi && aqi > 150) {
    alertQueue.push({
      priority: 0,
      type: "AQI",
      message: `Hazardous air quality detected (AQI: ${aqi})`,
      severity: "critical",
    });
  }

  if (rainPrediction && rainPrediction.probability > 70) {
    alertQueue.push({
      priority: 1,
      type: "Rain",
      message: `High probability of rain (${rainPrediction.probability}%)`,
      severity: "warning",
    });
  }

  if (weather && weather.temperature > 40) {
    alertQueue.push({
      priority: 1,
      type: "Heat",
      message: `Heatwave warning: ${weather.temperature}°C`,
      severity: "warning",
    });
  }

  if (weather && weather.temperature < -10) {
    alertQueue.push({
      priority: 1,
      type: "Cold",
      message: `Extreme cold warning: ${weather.temperature}°C`,
      severity: "warning",
    });
  }

  const alerts = [];
  while (alertQueue.size() > 0) {
    alerts.push(alertQueue.pop());
  }
  return alerts;
};

// Analytics Functions
export const calculateTrends = (historicalData) => {
  if (!historicalData || historicalData.length === 0) return null;

  const sorted = [...historicalData].sort(
    (a, b) => b.temperature - a.temperature,
  );
  const temps = historicalData.map((d) => d.temperature);

  return {
    hottestDay: sorted[0],
    coldestDay: sorted[sorted.length - 1],
    avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
    maxTemp: Math.max(...temps),
    minTemp: Math.min(...temps),
  };
};
