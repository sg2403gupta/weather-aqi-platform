import React from "react";
import { CloudRain, Droplets } from "lucide-react";

const RainPredictionCard = ({ rainPrediction }) => {
  if (!rainPrediction) return null;

  const getProbabilityColor = (prob) => {
    if (prob >= 70) return "text-blue-600";
    if (prob >= 40) return "text-yellow-600";
    return "text-gray-600 dark:text-gray-300";
  };

  const getProbabilityBg = (prob) => {
    if (prob >= 70) return "from-blue-500 to-blue-600";
    if (prob >= 40) return "from-yellow-500 to-yellow-600";
    return "from-gray-400 to-gray-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <CloudRain className="w-5 h-5 text-blue-600" />
        Rain Prediction (24h)
      </h2>
      <div>
        <div className="text-center mb-4">
          <div
            className={`inline-block bg-gradient-to-r ${getProbabilityBg(rainPrediction.probability)} text-white px-8 py-6 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300`}
          >
            <p className="text-5xl font-bold mb-2">
              {rainPrediction.probability}%
            </p>
            <p className="text-sm opacity-90">Probability of Rain</p>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                rainPrediction.confidence === "High"
                  ? "bg-green-100 text-green-800"
                  : rainPrediction.confidence === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              <Droplets className="w-3 h-3" />
              {rainPrediction.confidence} Confidence
            </span>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <p className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Contributing Factors:
          </p>
          {rainPrediction.factors.length > 0 ? (
            <div className="space-y-2">
              {rainPrediction.factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              No significant rain indicators detected
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RainPredictionCard;
