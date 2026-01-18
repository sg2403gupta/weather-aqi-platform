import React from "react";
import { Cloud, Droplets, Wind, Eye, Activity } from "lucide-react";

const statStyles = {
  humidity: {
    bg: "bg-blue-50 dark:bg-gray-700",
    iconBg: "bg-blue-100 dark:bg-gray-600",
    icon: "text-blue-600",
  },
  wind: {
    bg: "bg-cyan-50 dark:bg-gray-700",
    iconBg: "bg-cyan-100 dark:bg-gray-600",
    icon: "text-cyan-600",
  },
  cloud: {
    bg: "bg-indigo-50 dark:bg-gray-700",
    iconBg: "bg-indigo-100 dark:bg-gray-600",
    icon: "text-indigo-600",
  },
  pressure: {
    bg: "bg-purple-50 dark:bg-gray-700",
    iconBg: "bg-purple-100 dark:bg-gray-600",
    icon: "text-purple-600",
  },
};

const CurrentWeather = ({ weather, city }) => {
  const weatherStats = [
    {
      key: "humidity",
      icon: Droplets,
      label: "Humidity",
      value: `${weather.humidity}%`,
    },
    {
      key: "wind",
      icon: Wind,
      label: "Wind Speed",
      value: `${weather.windSpeed} km/h`,
    },
    {
      key: "cloud",
      icon: Eye,
      label: "Cloud Cover",
      value: `${weather.cloudCover}%`,
    },
    {
      key: "pressure",
      icon: Activity,
      label: "Pressure",
      value: `${Math.round(weather.pressure)} hPa`,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Cloud className="w-5 h-5 text-blue-600" />
        Current Weather – {city}
      </h2>

      <div className="space-y-4">
        {/* Temperature */}
        <div className="flex justify-center">
          <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl">
            <p className="text-7xl font-bold text-blue-600 mb-2">
              {Math.round(weather.temperature)}°
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Temperature
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {weatherStats.map((stat) => {
            const Icon = stat.icon;
            const styles = statStyles[stat.key];

            return (
              <div
                key={stat.key}
                className={`flex items-center gap-3 p-4 rounded-lg hover:shadow-md transition-all ${styles.bg}`}
              >
                <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                  <Icon className={`w-5 h-5 ${styles.icon}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
