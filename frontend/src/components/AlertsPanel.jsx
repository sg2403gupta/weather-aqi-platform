import React from "react";
import { AlertTriangle } from "lucide-react";

const AlertsPanel = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Active Alerts
        </h2>
        <span className="ml-auto bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {alerts.length}
        </span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-l-4 ${
              alert.severity === "critical"
                ? "bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-500"
                : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-600 dark:border-yellow-500"
            } transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  alert.severity === "critical"
                    ? "text-red-600 dark:text-red-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-white mb-1">
                  {alert.type} Alert
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
