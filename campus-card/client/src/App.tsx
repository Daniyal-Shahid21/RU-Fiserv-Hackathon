import { Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
