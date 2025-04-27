import React, { useState, useEffect } from "react";
import { useGetTopCountriesByYearQuery } from "../../store/api";
import { FaMedal, FaTrophy } from "react-icons/fa"; // Medal and Trophy Icons
import { FiAward } from "react-icons/fi"; // For additional medal icons if necessary

const TopCountriesCard = () => {
  const [selectedYear, setSelectedYear] = useState(2000); // Default to year 2000
  const [prevYear, setPrevYear] = useState(null);

  // Query data based on the selected year
  const { data = [], isLoading, isError } = useGetTopCountriesByYearQuery(
    {
      year: selectedYear,  // Pass the selected year to the query
      top_n: 5,            // Fetch top 5 countries
    },
    {
      enabled: selectedYear !== prevYear, // Only enable the request if the selected year is different from the previous year
    }
  );

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);  // Update selected year on change
    setSelectedYear(newYear);
  };

  useEffect(() => {
    setPrevYear(selectedYear); // Update the previous year for optimization
  }, [selectedYear]);

  if (isLoading) {
    return (
      <div className="p-4 bg-neutral-800 shadow-lg rounded-lg text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (isError || !data.length) {
    return (
      <div className="p-4 bg-neutral-800 shadow-lg rounded-lg text-center text-red-500">
        Failed to load data or no data available.
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 text-white p-6 shadow-xl rounded-xl border border-gray-700 hover:shadow-2xl transition-all ease-in-out duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FaTrophy className="text-white text-2xl" /> {/* White Trophy Icon */}
          <h3 className="text-xl font-semibold text-olympiq-blue">Top 5 Countries ({selectedYear})</h3>
        </div>

        {/* Year Selector */}
        <select
          id="year-selector"
          value={selectedYear}
          onChange={handleYearChange}
          className="p-2 bg-neutral-900 border border-gray-600 rounded-lg shadow-sm text-olympiq-blue focus:ring-2 focus:ring-olympiq-blue"
        >
          {[2024, 2020, 2016, 2012, 2008, 2004, 2002, 2000].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* List of Top Countries */}
      <ul className="space-y-3">
        {data
          .filter((country) => country.Year === selectedYear) // Filter countries based on selected year
          .map((country, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 rounded-lg shadow-sm bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 ease-in-out"
            >
              <div className="flex items-center space-x-3">
                {/* Medal Icons with Rank-based Color */}
                <div className="text-white text-2xl">
                  {index === 0 ? (
                    <FaMedal className="text-yellow-500" /> // Gold
                  ) : index === 1 ? (
                    <FaMedal className="text-gray-400" /> // Silver
                  ) : index === 2 ? (
                    <FaMedal className="text-brown-500" /> // Bronze
                  ) : (
                    <FiAward className="text-white" /> // Other rank
                  )}
                </div>
                <span className="font-medium text-lg text-gray-100">{country.Country}</span>
              </div>
              <div className="bg-yellow-600 text-yellow-100 px-4 py-1 rounded-full text-sm font-medium">
                {country.Total} Medals
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TopCountriesCard;
