import React from "react";
import { Calendar, Droplets, Sun, Cloud } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const ForecastTab = ({ forecast, weather }) => {
  const isDark = document.documentElement.classList.contains("dark");

  const getWeatherIcon = (temp, precipitation) => {
    if (precipitation > 5)
      return <Droplets className="w-6 h-6 text-blue-500" />;
    if (temp > 25) return <Sun className="w-6 h-6 text-yellow-500" />;
    return <Cloud className="w-6 h-6 text-gray-500 dark:text-gray-300" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        7-Day Forecast
      </h2>

      {/* Forecast Cards */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-8">
        {forecast.map((day, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl text-center transition-all duration-200 hover:shadow-lg hover:scale-105
                       bg-gradient-to-br from-blue-50 to-indigo-50
                       dark:from-gray-700 dark:to-gray-600"
          >
            <p className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
              {day.date}
            </p>

            <div className="flex justify-center mb-3">
              {getWeatherIcon(day.maxTemp, day.precipitation)}
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(day.maxTemp)}°
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {Math.round(day.minTemp)}°
              </p>

              <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-300 mt-2">
                <Droplets className="w-3 h-3" />
                <span>{day.precipitation.toFixed(1)}mm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Hourly Humidity & Precipitation Probability
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weather.hourly.slice(0, 24)}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />

            <XAxis
              dataKey="time"
              stroke={isDark ? "#d1d5db" : "#6b7280"}
              style={{ fontSize: "12px" }}
            />

            <YAxis
              stroke={isDark ? "#d1d5db" : "#6b7280"}
              style={{ fontSize: "12px" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2933" : "#ffffff",
                border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                borderRadius: "8px",
                color: isDark ? "#e5e7eb" : "#111827",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#10b981"
              name="Humidity %"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="precipitation"
              stroke="#3b82f6"
              name="Precipitation %"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastTab;
