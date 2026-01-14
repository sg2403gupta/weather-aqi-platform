import React from "react";

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["overview", "forecast", "analytics"];

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
