import React, { useState } from "react";
import { Search, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-neutral-900 shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-white">OlympIQ</span>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="hidden md:flex items-center justify-center gap-2 px-2 bg-neutral-700 rounded-full py-3 shadow-inner min-w-md">
        <button
          className={`text-md font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${
            activeTab === "Dashboard"
              ? "bg-white text-black"
              : "text-neutral-300 hover:text-white"
          }`}
          onClick={() => {
            setActiveTab("Dashboard");
            navigate("/");
          }}
        >
          Dashboard
        </button>
        <button
          className={`text-md font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${
            activeTab === "Insights"
              ? "bg-white text-black"
              : "text-neutral-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("Insights")}
        >
          Insights
        </button>
        <button
          className={`text-md font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${
            activeTab === "Finance"
              ? "bg-white text-black"
              : "text-neutral-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("Finance")}
        >
          Finance
        </button>
        <button
          className={`text-md font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${
            activeTab === "Reports"
              ? "bg-white text-black"
              : "text-neutral-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("Reports")}
        >
          Reports
        </button>
      </nav>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-neutral-700 rounded-full hover:bg-neutral-600 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95">
          <Search size={18} />
        </div>
        <div
          className="p-3 bg-neutral-700 rounded-full hover:bg-neutral-600 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
          on
          onClick={() => {
            navigate("settings");
          }}
        >
          <Settings size={18} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
