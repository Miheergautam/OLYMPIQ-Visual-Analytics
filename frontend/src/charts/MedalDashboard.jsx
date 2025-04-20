import React from "react";
import { useGetMedalsQuery } from "../store/api";

const MedalDashboard = () => {
  const { data, isLoading, isError } = useGetMedalsQuery();

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Failed to load data.</div>;

  // If no data is available
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No medal data available.</div>;
  }

  return (
    <div className="p-6 space-y-6 shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">🏅 All Medals Data</h1>

      {/* Medal Data Table */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Medals Information</h2>
        <div className="overflow-auto max-h-[70vh] border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Country</th>
                <th className="px-4 py-2">Gold</th>
                <th className="px-4 py-2">Silver</th>
                <th className="px-4 py-2">Bronze</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Year</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{item.Country}</td>
                  <td className="text-center">{item.Gold}</td>
                  <td className="text-center">{item.Silver}</td>
                  <td className="text-center">{item.Bronze}</td>
                  <td className="text-center">{item.Total}</td>
                  <td className="text-center">{item.Year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MedalDashboard;
