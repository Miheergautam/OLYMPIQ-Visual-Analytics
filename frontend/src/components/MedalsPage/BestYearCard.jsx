import React from "react";
import { useGetMedalsQuery } from "../../store/api";
import { Star } from "lucide-react";  // Optional icon for added visual flair

const BestYearCard = ({ selectedYear }) => {
  const { data, isLoading } = useGetMedalsQuery();

  if (isLoading) return <div className="p-6 bg-white shadow-md rounded-xl text-center text-gray-500">Loading...</div>;

  // Find the year with the highest total medals
  const bestYear = data?.reduce(
    (max, country) => (country.Total > max.Total ? country : max),
    { Total: 0 }
  );

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all ease-in-out duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <Star className="text-yellow-500" size={28} />
        <h3 className="text-2xl font-semibold text-gray-800">Best Year for Medals</h3>
      </div>
      <p className="text-lg text-gray-700">
        The best year for medals was <span className="font-semibold text-gray-900">{bestYear?.Year}</span> with{" "}
        <span className="font-semibold text-yellow-600">{bestYear?.Total}</span> total medals.
      </p>
    </div>
  );
};

export default BestYearCard;
