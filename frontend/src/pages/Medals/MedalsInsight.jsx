import React from "react";
import OlympicPerformanceChart from "../../charts/OlympicPerformanceChart"
import MedalLineChart from "../../charts/MedalLineChart";

const MedalsPage = () => {
  return (
    <div className="p-6 space-y-8">
      <OlympicPerformanceChart/>
      <MedalLineChart/>
    </div>
  );
};

export default MedalsPage;