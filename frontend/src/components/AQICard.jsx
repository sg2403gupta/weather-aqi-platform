import React from "react";
import { categorizeAQI } from "../utils/algorithms";

const AQICard = ({ aqi }) => {
  if (!aqi) return null;

  const category = categorizeAQI(aqi);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Air Quality Index
      </h2>
      <div>
        <div className="flex justify-center mb-4">
          <div className={`text-center p-6 rounded-lg ${category.bg}`}>
            <p className="text-5xl font-bold mb-2">{aqi}</p>
            <p className={`text-lg font-semibold ${category.color}`}>
              {category.category}
            </p>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
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
      </div>
    </div>
  );
};

export default AQICard;
