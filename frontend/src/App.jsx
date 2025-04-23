import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import MedalsPage from "./pages/MedalsPage";
import GDPPage from "./pages/GDPPage";
import HealthExpenditurePage from "./pages/HealthExpenditurePage";
import PopulationPage from "./pages/PopulationPage";
import PoliticalStabilityPage from "./pages/PoliticalStabilityPage";
import LiteracyRatePage from "./pages/LiteracyRatePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />}>
            <Route path="medals" element={<MedalsPage />} />
            <Route path="gdp" element={<GDPPage />} />
            <Route path="health" element={<HealthExpenditurePage />} />
            <Route path="population" element={<PopulationPage />} />
            <Route path="stability" element={<PoliticalStabilityPage />} />
            <Route path="literacy" element={<LiteracyRatePage />} />
          </Route>
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
