import React from "react";
import EducationExpenditureChart from "../../charts/EducationExpenditureChart";
import StackedNormalizedAreaChart from "../../charts/StackedNormalizedAreaChart";

const EducationExpenditureInsights = () => {
  return (
    <div className="text-white space-y-10">
      <EducationExpenditureChart/>
      <StackedNormalizedAreaChart/>
    </div>
  );
};

export default EducationExpenditureInsights;
