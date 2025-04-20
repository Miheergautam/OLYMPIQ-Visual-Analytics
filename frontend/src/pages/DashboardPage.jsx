// DashboardPage.jsx
import React from "react";
import MedalDashboard from "../charts/MedalDashboard";

const DashboardPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h1>
      <p className="text-gray-600">
        Here you can add your dynamic content, such as charts, tables, etc.
      </p>
      {/* More content */}
      <MedalDashboard/>

    </div>
  );
};

export default DashboardPage;