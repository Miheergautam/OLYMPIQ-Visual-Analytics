import React from "react";
import ChoroplethMap2 from "../../charts/ChoroplethMap2";

const GDPPage = () => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">GDP Overview</h2>
      <ChoroplethMap2 />
    </div>
  );
};

export default GDPPage;
