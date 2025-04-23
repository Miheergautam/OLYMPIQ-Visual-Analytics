import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardPage;
