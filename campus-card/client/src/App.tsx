import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import WelcomePage from "./components/WelcomePage";
import Dashboard from "./components/Dashboard";
import BalanceAnalysisPage from "./components/BalanceAnalysisPage";
import Profile from "./components/Profile";
// import CreditScorePage from "./components/CreditScorePage";
// import CreditTransfersPage from "./components/CreditTransfersPage";
// import StudentServicesPage from "./components/StudentServicesPage";
// import EventsPage from "./components/EventsPage";

const App: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-prussian">
        <p className="text-sm">Loading your campus wallet...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navbar only when authenticated */}
      {isAuthenticated && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Root: dashboard when authed, welcome when not */}
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <WelcomePage />}
          />

          {/* Balance Analysis */}
          <Route
            path="/balance-analysis"
            element={isAuthenticated ? <BalanceAnalysisPage /> : <WelcomePage />}
          />

          {/* Profile page (person icon) */}
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <WelcomePage />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
