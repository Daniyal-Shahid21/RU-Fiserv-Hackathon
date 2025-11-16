import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import WelcomePage from "./components/WelcomePage";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-prussian">
        <p className="text-sm">Loading your campus wallet...</p>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <WelcomePage />;
};

export default App;
