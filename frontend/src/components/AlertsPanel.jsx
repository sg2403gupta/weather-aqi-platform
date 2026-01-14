import React from "react";
import { AlertTriangle } from "lucide-react";

const AlertsPanel = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-bold text-gray-800">Active Alerts</h2>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-l-4 ${
              alert.severity === "critical"
                ? "bg-red-50 border-red-600"
                : "bg-yellow-50 border-yellow-600"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle
                className={`w-5 h-5 mt-0.5 ${
                  alert.severity === "critical"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {alert.type} Alert
                </p>
                <p className="text-gray-600">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
