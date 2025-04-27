import React from "react";
import { useGetMedalsQuery } from "../../store/api";
import { Medal } from "lucide-react";

const FirstMedalCard = () => {
  const { data, isLoading, isError } = useGetMedalsQuery();

  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (isError || !data?.length) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center text-red-500">
        Failed to load data or no data available.
      </div>
    );
  }

  // Find the first country to win a medal (earliest year)
  const firstMedal = data.reduce(
    (first, country) => (country.Year < first.Year ? country : first),
    { Year: Infinity }
  );

  return (
    <div className="bg-gradient-to-br from-green-50 to-gray-100 p-6 shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all ease-in-out duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <Medal className="text-green-600" size={28} />
        <h3 className="text-2xl font-semibold text-gray-800">First Country to Win a Medal</h3>
      </div>
      <p className="text-lg text-gray-700">
        <span className="font-semibold text-gray-900">{firstMedal.Country}</span> was the first to win a medal in{" "}
        <span className="font-semibold text-green-600">{firstMedal.Year}</span>.
      </p>
    </div>
  );
};

export default FirstMedalCard;
