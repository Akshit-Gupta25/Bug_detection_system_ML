import { Routes, Route, Navigate } from "react-router-dom";
import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home      from "./pages/Home";
import History   from "./pages/History";   // ← NEW
import Pricing   from "./pages/Pricing";   // ← NEW

function App() {
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/signup"    element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history"   element={<History />} />   {/* ← NEW */}
      <Route path="/pricing"   element={<Pricing />} />   {/* ← NEW */}
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;