import React from "react";
import { Wind } from "lucide-react";
import { categorizeAQI } from "../utils/algorithms";

const AQICard = ({ aqi }) => {
  if (!aqi) return null;

  const category = categorizeAQI(aqi);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Wind className="w-5 h-5 text-blue-600" />
        Air Quality Index
      </h2>
      <div>
        <div className="flex justify-center mb-4">
          <div
            className={`text-center p-6 rounded-2xl ${category.bg} transition-all duration-300 hover:scale-105`}
          >
            <p className="text-6xl font-bold mb-2">{aqi}</p>
            <p className={`text-lg font-semibold ${category.color}`}>
              {category.category}
            </p>
          </div>
        </div>

        {/* AQI Progress Bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${Math.min((aqi / 300) * 100, 100)}%`,
              background:
                aqi <= 50
                  ? "#10b981"
                  : aqi <= 100
                    ? "#fbbf24"
                    : aqi <= 200
                      ? "#f59e0b"
                      : "#ef4444",
            }}
          />
        </div>

        {/* AQI Scale */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="w-full h-2 bg-green-500 rounded mb-1"></div>
            <p className="text-gray-600 dark:text-gray-300">0-50 Good</p>
          </div>
          <div className="text-center">
            <div className="w-full h-2 bg-yellow-500 rounded mb-1"></div>
            <p className="text-gray-600 dark:text-gray-300">51-100 Moderate</p>
          </div>
          <div className="text-center">
            <div className="w-full h-2 bg-red-500 rounded mb-1"></div>
            <p className="text-gray-600 dark:text-gray-300">101+ Unhealthy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQICard;
