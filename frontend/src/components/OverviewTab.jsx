import React from "react";
import CurrentWeather from "./CurrentWeather";
import AQICard from "./AQICard";
import RainPredictionCard from "./RainPredictionCard";
import WeatherChart from "./WeatherChart";

const OverviewTab = ({ weather, city, aqi, rainPrediction }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CurrentWeather weather={weather} city={city} />

        <div className="space-y-6">
          <AQICard aqi={aqi} />
          <RainPredictionCard rainPrediction={rainPrediction} />
        </div>
      </div>

      <WeatherChart data={weather.hourly} title="48-Hour Temperature Trend" />
    </>
  );
};

export default OverviewTab;
