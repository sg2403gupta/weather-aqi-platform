import React from "react";
import { Search } from "lucide-react";

const Header = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide">
            Weather & AQI Platform
          </h1>
        </div>

        {/* Search Section */}
        <div className="flex w-full lg:w-auto gap-2">
          <div className="flex items-center w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Search className="w-4 h-4 text-blue-600 mr-2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter city name..."
              className="w-full focus:outline-none text-gray-700"
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-semibold"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
