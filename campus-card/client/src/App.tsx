import { Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Dashboard from "./components/Dashboard";
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

export default App;
