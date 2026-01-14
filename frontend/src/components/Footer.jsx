import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
      {/* Brand / Identity */}
      <p className="font-semibold text-gray-800">Weather & AQI Platform</p>

      {/* Tech Stack */}
      <p className="mt-1">
        Built with React • Optimized using Data Structures & Algorithms
      </p>

      {/* Features */}
      <p className="mt-1">
        Smart Caching • Predictive Analytics • Priority-Based Alerts
      </p>

      {/* Data Source */}
      <p className="mt-2 text-xs text-gray-500">
        Weather data powered by Open-Meteo API
      </p>

      {/* Copyright / Ownership */}
      <p className="mt-3 text-xs text-gray-400">
        © {new Date().getFullYear()} Weather & AQI Platform — Developed by
        Shubham Gupta. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
