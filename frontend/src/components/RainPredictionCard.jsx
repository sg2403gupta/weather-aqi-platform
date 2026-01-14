import React from "react";

const RainPredictionCard = ({ rainPrediction }) => {
  if (!rainPrediction) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Rain Prediction (24h)
      </h2>
      <div>
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {rainPrediction.probability}%
          </p>
          <p className="text-gray-600">Probability of Rain</p>
          <p className="text-sm text-gray-500 mt-1">
            Confidence: {rainPrediction.confidence}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-gray-700">Contributing Factors:</p>
          {rainPrediction.factors.length > 0 ? (
            rainPrediction.factors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                {factor}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No significant rain indicators detected
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RainPredictionCard;
