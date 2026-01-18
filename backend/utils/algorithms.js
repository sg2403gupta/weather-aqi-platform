// Rain Prediction Algorithm
const predictRain = (hourlyData) => {
  if (!hourlyData || hourlyData.length === 0) {
    return { probability: 0, factors: [], confidence: "Low" };
  }

  let score = 0;
  const factors = [];

  // Sliding window - next 24 hours
  const window = hourlyData.slice(0, 24);

  // Calculate averages
  const avgHumidity =
    window.reduce((sum, h) => sum + (h.relative_humidity_2m || 0), 0) /
    window.length;
  const avgPressure =
    window.reduce((sum, h) => sum + (h.pressure_msl || 0), 0) / window.length;
  const avgCloud =
    window.reduce((sum, h) => sum + (h.cloud_cover || 0), 0) / window.length;

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
  const hasPrecip = window.some((h) => (h.precipitation_probability || 0) > 50);
  if (hasPrecip) {
    score += 30;
    factors.push("Precipitation in forecast");
  }

  const probability = Math.min(score, 100);
  const confidence =
    factors.length >= 3 ? "High" : factors.length >= 2 ? "Medium" : "Low";

  return { probability, factors, confidence };
};

// AQI Categorization
const categorizeAQI = (aqi) => {
  if (aqi <= 50)
    return {
      category: "Good",
      color: "#10b981",
      priority: 4,
      description: "Air quality is satisfactory",
    };
  if (aqi <= 100)
    return {
      category: "Moderate",
      color: "#fbbf24",
      priority: 3,
      description: "Air quality is acceptable",
    };
  if (aqi <= 150)
    return {
      category: "Unhealthy for Sensitive",
      color: "#f59e0b",
      priority: 2,
      description: "Sensitive groups may experience health effects",
    };
  if (aqi <= 200)
    return {
      category: "Unhealthy",
      color: "#ef4444",
      priority: 1,
      description: "Everyone may begin to experience health effects",
    };
  if (aqi <= 300)
    return {
      category: "Very Unhealthy",
      color: "#a855f7",
      priority: 0,
      description: "Health alert: everyone may experience serious effects",
    };
  return {
    category: "Hazardous",
    color: "#7f1d1d",
    priority: 0,
    description: "Health warnings of emergency conditions",
  };
};

// Calculate Analytics
const calculateTrends = (dailyData) => {
  if (!dailyData || dailyData.length === 0) return null;

  const temps = dailyData.map((d) => d.temperature_2m_max);
  const sorted = [...temps].sort((a, b) => b - a);

  return {
    maxTemp: Math.max(...temps),
    minTemp: Math.min(...temps),
    avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
    hottestDay: dailyData[temps.indexOf(sorted[0])],
    coldestDay: dailyData[temps.indexOf(sorted[sorted.length - 1])],
  };
};

module.exports = {
  predictRain,
  categorizeAQI,
  calculateTrends,
};
