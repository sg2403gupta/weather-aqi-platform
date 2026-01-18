import React from "react";
import { Search, Cloud } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 fade-in transition-colors duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        {/* Brand */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-40 rounded-xl" />
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
              <Cloud className="w-9 h-9 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Weather & AQI
          </h1>
        </div>

        {/* Search + Actions */}
        <div className="flex gap-2 w-full md:w-auto items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search city..."
            aria-label="Search city"
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:w-64 transition"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Search className="w-4 h-4" />
            Search
          </button>

          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
