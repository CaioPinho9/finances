import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./views/Dashboard.tsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
