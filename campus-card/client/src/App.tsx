import { Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default App;
