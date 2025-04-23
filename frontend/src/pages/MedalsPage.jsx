import React, { useState } from "react";
import { useGetMedalsQuery } from "../store/api";
import { Trophy, Medal, Star, Award, Filter } from "lucide-react";

// MedalCard component
const MedalCard = ({ title, count, icon: Icon, color }) => (
  <div className="flex items-center gap-4 bg-neutral-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
      <Icon size={28} className={color} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-xl font-bold text-white">{count}</p>
    </div>
  </div>
);

const FilterModal = ({ isOpen, onClose, onApply, countries, metrics }) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState(metrics);

  const handleApply = () => {
    onApply(selectedCountry, selectedMetrics);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Filter Medals</h2>
        <div className="mb-4">
          <label className="block mb-2">Select Country:</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-2 rounded-lg bg-neutral-800 text-white"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Select Metrics:</label>
          {metrics.map((metric) => (
            <label key={metric} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric)}
                onChange={() => {
                  if (selectedMetrics.includes(metric)) {
                    setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
                  } else {
                    setSelectedMetrics([...selectedMetrics, metric]);
                  }
                }}
                className="mr-2"
              />
              {metric}
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const MedalsPage = () => {
  const { data: medals, error, isLoading } = useGetMedalsQuery();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([
    "Gold Medals",
    "Silver Medals",
    "Bronze Medals",
    "Total Medals",
  ]);
  const [selectedCountry, setSelectedCountry] = useState("");

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) {
    console.error(error);
    return <p className="text-white">Error: {error.message || 'An unknown error occurred'}</p>;
  }

  if (!Array.isArray(medals)) {
    return <p className="text-white">Error: Invalid data format</p>;
  }

  // Filter medals by selected year if any
  const filteredMedals = selectedYear
    ? medals.filter((medal) => medal.Year === parseInt(selectedYear))
    : medals;

  // Group medals by country
  const groupedByCountry = filteredMedals.reduce((acc, medal) => {
    if (!acc[medal.Country]) {
      acc[medal.Country] = { gold: 0, silver: 0, bronze: 0, total: 0 };
    }
    acc[medal.Country].gold += medal.Gold;
    acc[medal.Country].silver += medal.Silver;
    acc[medal.Country].bronze += medal.Bronze;
    acc[medal.Country].total += medal.Total;
    return acc;
  }, {});

  // Get unique countries and years for filter dropdown
  const countries = [...new Set(medals.map((medal) => medal.Country))];
  const years = [...new Set(medals.map((medal) => medal.Year))];

  const handleFilterApply = (country, metrics) => {
    setSelectedCountry(country);
    setSelectedMetrics(metrics);
    const filtered = Object.keys(groupedByCountry).filter((country) => {
      if (selectedCountry && country !== selectedCountry) return false;
      const { gold, silver, bronze, total } = groupedByCountry[country];
      return (
        (metrics.includes("Gold Medals") && gold > 0) ||
        (metrics.includes("Silver Medals") && silver > 0) ||
        (metrics.includes("Bronze Medals") && bronze > 0) ||
        (metrics.includes("Total Medals") && total > 0)
      );
    });
    setFilteredData(filtered);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Medals Overview</h2>

      {/* Year Filter */}
      <div className="flex justify-between items-center mb-6">
        <label htmlFor="year" className="text-white">Filter by Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-neutral-800 text-white p-2 rounded-lg"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 text-white bg-blue-600 p-3 rounded-lg"
        >
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {/* Display filtered medals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData.length
          ? filteredData.map((country) => {
              const { gold, silver, bronze, total } = groupedByCountry[country];
              return (
                <div key={country} className="bg-neutral-800 p-6 rounded-2xl shadow-md">
                  <h3 className="text-xl font-semibold text-white">{country}</h3>
                  <div className="space-y-4 mt-4">
                    {selectedMetrics.includes("Gold Medals") && gold > 0 && <MedalCard title="Gold Medals" count={gold} icon={Star} color="text-yellow-400" />}
                    {selectedMetrics.includes("Silver Medals") && silver > 0 && <MedalCard title="Silver Medals" count={silver} icon={Medal} color="text-gray-300" />}
                    {selectedMetrics.includes("Bronze Medals") && bronze > 0 && <MedalCard title="Bronze Medals" count={bronze} icon={Award} color="text-orange-500" />}
                    {selectedMetrics.includes("Total Medals") && total > 0 && <MedalCard title="Total Medals" count={total} icon={Trophy} color="text-[var(--olympiq-blue)]" />}
                  </div>
                </div>
              );
            })
          : "No data matches the selected filters."}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        countries={countries}
        metrics={["Gold Medals", "Silver Medals", "Bronze Medals", "Total Medals"]}
      />
    </div>
  );
};

export default MedalsPage;
