import React from "react";
import { useGetMedalsQuery } from "../../store/api";
import { BarChart3 } from "lucide-react";

const HighestMedalYearCard = () => {
  const { data = [], isLoading, isError } = useGetMedalsQuery();

  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (isError || !data.length) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center text-red-500">
        Failed to load data or no data available.
      </div>
    );
  }

  const medalsByYear = data.reduce((acc, item) => {
    acc[item.Year] = (acc[item.Year] || 0) + item.Total;
    return acc;
  }, {});

  const highestYear = Object.entries(medalsByYear).reduce(
    (max, [year, total]) =>
      total > max.total ? { year: parseInt(year), total } : max,
    { year: 0, total: 0 }
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 p-6 shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all ease-in-out duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="text-blue-600" size={28} />
        <h3 className="text-2xl font-semibold text-gray-800">Top Year by Total Medals</h3>
      </div>
      <p className="text-lg text-gray-700">
        <strong className="text-gray-900">{highestYear.year}</strong> had the highest medal tally with{" "}
        <span className="font-semibold text-blue-600">{highestYear.total}</span> medals.
      </p>
    </div>
  );
};

export default HighestMedalYearCard;
