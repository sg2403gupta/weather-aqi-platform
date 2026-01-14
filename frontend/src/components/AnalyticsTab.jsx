import React from "react";
import { TrendingUp } from "lucide-react";
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

const AnalyticsTab = ({ trends, forecast }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Weather Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Highest Temperature</p>
          <p className="text-4xl font-bold text-red-600">
            {Math.round(trends.maxTemp)}°C
          </p>
        </div>
        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Average Temperature</p>
          <p className="text-4xl font-bold text-blue-600">
            {Math.round(trends.avgTemp)}°C
          </p>
        </div>
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Lowest Temperature</p>
          <p className="text-4xl font-bold text-indigo-600">
            {Math.round(trends.minTemp)}°C
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          7-Day Temperature Range
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="maxTemp"
              stroke="#ef4444"
              name="Max Temp (°C)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="minTemp"
              stroke="#3b82f6"
              name="Min Temp (°C)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsTab;
