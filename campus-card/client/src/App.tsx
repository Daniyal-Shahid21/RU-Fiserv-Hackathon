import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import WelcomePage from "./components/WelcomePage";
import Dashboard from "./components/Dashboard";
<<<<<<< HEAD
import Profile from "./components/Profile";
import BalanceAnalysisPage from "./components/BalanceAnalysisPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/balance/analysis" element={<BalanceAnalysisPage />} />
    </Routes>
  );
}
=======

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
>>>>>>> 915c237d9d6c357deb6c4306475f3c78d5fbe459

export default App;
