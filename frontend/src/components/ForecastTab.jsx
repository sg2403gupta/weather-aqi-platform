import React from "react";
import { Calendar, Droplets } from "lucide-react";
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
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        7-Day Forecast
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {forecast.map((day, idx) => (
          <div
            key={idx}
            className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center"
          >
            <p className="font-semibold text-gray-800 mb-2">{day.date}</p>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(day.maxTemp)}°
              </p>
              <p className="text-sm text-gray-600">
                {Math.round(day.minTemp)}°
              </p>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                <Droplets className="w-4 h-4" />
                <span>{day.precipitation}mm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Hourly Humidity & Precipitation
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weather.hourly.slice(0, 24)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#10b981"
              name="Humidity %"
            />
            <Line
              type="monotone"
              dataKey="precipitation"
              stroke="#3b82f6"
              name="Precipitation %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastTab;
