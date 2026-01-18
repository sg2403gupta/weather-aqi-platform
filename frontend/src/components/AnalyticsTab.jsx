import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
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

const statStyles = {
  max: {
    gradient: "from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-600",
    iconBg: "bg-red-100 dark:bg-gray-600",
    text: "text-red-600",
  },
  avg: {
    gradient: "from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600",
    iconBg: "bg-blue-100 dark:bg-gray-600",
    text: "text-blue-600",
  },
  min: {
    gradient: "from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600",
    iconBg: "bg-indigo-100 dark:bg-gray-600",
    text: "text-indigo-600",
  },
};

const AnalyticsTab = ({ trends, forecast }) => {
  const isDark = document.documentElement.classList.contains("dark");

  const stats = [
    {
      key: "max",
      label: "Highest Temperature",
      value: `${Math.round(trends.maxTemp)}°C`,
      icon: TrendingUp,
    },
    {
      key: "avg",
      label: "Average Temperature",
      value: `${Math.round(trends.avgTemp)}°C`,
      icon: Activity,
    },
    {
      key: "min",
      label: "Lowest Temperature",
      value: `${Math.round(trends.minTemp)}°C`,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Weather Analytics
      </h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const styles = statStyles[stat.key];

          return (
            <div
              key={stat.key}
              className={`p-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br ${styles.gradient}`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </p>
                <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                  <Icon className={`w-5 h-5 ${styles.text}`} />
                </div>
              </div>
              <p className={`text-4xl font-bold ${styles.text}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Temperature Range Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          7-Day Temperature Range
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecast}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#d1d5db" : "#6b7280"}
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke={isDark ? "#d1d5db" : "#6b7280"}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                borderRadius: "8px",
                color: isDark ? "#e5e7eb" : "#111827",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="maxTemp"
              stroke="#ef4444"
              name="Max Temp (°C)"
              strokeWidth={3}
              dot={{ fill: "#ef4444", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="minTemp"
              stroke="#3b82f6"
              name="Min Temp (°C)"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
            Temperature Variance
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(trends.maxTemp - trends.minTemp)}°C
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Range over 7 days
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
            Data Points
          </h4>
          <p className="text-2xl font-bold text-green-600">{forecast.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Days analyzed
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
