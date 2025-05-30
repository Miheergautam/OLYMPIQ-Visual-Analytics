import React from "react";
import SidebarDashboard from "../components/SidebarDashboard";
import { Outlet, useOutlet } from "react-router-dom";

const DashboardPage = () => {
  const outlet = useOutlet();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {outlet || (
          <div className="flex flex-col items-center justify-center h-full text-center text-white">
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-[var(--olympiq-blue)] to-sky-400 bg-clip-text text-transparent animate-pulse">
              Welcome to the OlympIQ Dashboard!
            </h1>
            <p className="text-lg text-neutral-400">
              Select an option from the sidebar to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;