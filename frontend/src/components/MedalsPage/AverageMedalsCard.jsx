import React, { useState, useMemo } from "react";
import { useGetTopCountriesByYearQuery } from "../../store/api";
import { FaMedal } from "react-icons/fa";

const AverageMedalsCard = () => {
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedCountry, setSelectedCountry] = useState("");

  const { data = [], isLoading, isError } = useGetTopCountriesByYearQuery({
    year: selectedYear,
    top_n: 100,
  });

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const countriesForYear = useMemo(() => {
    return data.filter((country) => country.Year === selectedYear);
  }, [data, selectedYear]);

  const calculateAverageMedals = (data) => {
    const totalMedals = data.reduce((acc, country) => acc + country.Total, 0);
    const numberOfCountries = data.length;
    return numberOfCountries > 0
      ? Math.round(totalMedals / numberOfCountries)
      : 0;
  };

  const calculateCountryAverage = (country) => {
    const countryData = countriesForYear.filter((c) => c.Country === country);
    const totalMedals = countryData.reduce((acc, c) => acc + c.Total, 0);
    return countryData.length > 0
      ? Math.round(totalMedals / countryData.length)
      : 0;
  };

  const averageMedals = selectedCountry
    ? calculateCountryAverage(selectedCountry)
    : calculateAverageMedals(countriesForYear);

  const uniqueCountries = useMemo(() => {
    const countries = countriesForYear.map((country) => country.Country);
    return [...new Set(countries)];
  }, [countriesForYear]);

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
    <div className="bg-neutral-900 text-white p-6 shadow-xl rounded-xl border border-gray-700 hover:shadow-2xl transition-all duration-300 transform">
      <div className="flex flex-col items-center gap-5 mb-6">
        <div className="flex items-center space-x-3">
          <FaMedal className="text-white text-3xl" />
          <h3 className="text-xl font-semibold text-olympiq-blue">
            Average Medals per Country ({selectedYear})
          </h3>
        </div>
        <div className="flex gap-4">
          <select
            id="year-selector"
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 bg-neutral-800 border border-gray-600 rounded-lg shadow-md text-olympiq-blue focus:ring-2 focus:ring-olympiq-blue focus:outline-none"
          >
            {[2024, 2020, 2016, 2012, 2008, 2004, 2002, 2000].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            id="country-selector"
            value={selectedCountry}
            onChange={handleCountryChange}
            className="p-2 bg-neutral-800 border border-gray-600 rounded-lg shadow-md text-olympiq-blue focus:ring-2 focus:ring-olympiq-blue focus:outline-none"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-6 p-4">
        <div className="bg-neutral-800 p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300">
          <h4 className="text-lg font-semibold text-gray-300 mb-2">
            {selectedCountry
              ? `Average Medals for ${selectedCountry}`
              : "Average Medals per Country"}
          </h4>
          <p className="text-3xl font-bold text-yellow-500">
            {averageMedals} Medals
          </p>
        </div>
      </div>
    </div>
  );
};

export default AverageMedalsCard;
