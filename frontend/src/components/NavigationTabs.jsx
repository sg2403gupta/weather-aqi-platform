import React from "react";
import { LayoutDashboard, Calendar, TrendingUp } from "lucide-react";

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "forecast", label: "Forecast", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden fade-in">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationTabs;
