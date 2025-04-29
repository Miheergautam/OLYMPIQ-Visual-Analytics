import React from "react";
import ChoroplethMap from "../../charts/ChoroplethMap";

const GDPPage = () => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">GDP Overview</h2>
      <ChoroplethMap />
    </div>
  );
};

export default GDPPage;
