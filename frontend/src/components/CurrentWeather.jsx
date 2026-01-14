import React from "react";
import { Cloud, Droplets, Wind, Eye, Activity } from "lucide-react";

const CurrentWeather = ({ weather, city }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Cloud className="w-5 h-5" />
        Current Weather - {city.charAt(0).toUpperCase() + city.slice(1)}
      </h2>
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-6xl font-bold text-blue-600">
              {Math.round(weather.temperature)}°C
            </p>
            <p className="text-gray-600 mt-2">Temperature</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Wind className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="font-semibold">{weather.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Cloud Cover</p>
              <p className="font-semibold">{weather.cloudCover}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Pressure</p>
              <p className="font-semibold">
                {Math.round(weather.pressure)} hPa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
