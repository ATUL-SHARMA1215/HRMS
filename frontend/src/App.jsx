import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={nav}>
          <Link to="/" style={linkStyle}>Employees</Link>
          <Link to="/attendance" style={linkStyle}>Attendance</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const nav = {
  padding: 15,
  background: "#222",
  display: "flex",
  gap: 20,
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};