import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import PropTypes from "prop-types";
import KanbanBoard from "./Workspace";
import "./workspace.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🏠 Home Page
function HomePage() {
  return (
    <>
      <div className="content1">
        <div className="words1">
          <h1>Speed up your progress by working in an efficient way</h1>
          <p>
            See your projects from every angle with Board, Timeline, Table, Calendar, Dashboard, Map, and Workspace views that will bring a fresh perspective to the task at hand.
          </p>
        </div>
      </div>

      <div className="content2">
        <div className="words1">
          <h1>Stay Organized and Collaborate</h1>
          <p>
            Manage your workflow, assign tasks, and track progress effortlessly with your team.
          </p>
        </div>
      </div>
    </>
  );
}

// 🛠️ Workspace Component
function Workspace() {
  return (
    <div className="Workspace">
      <h2>📢 Workspace</h2>
      <KanbanBoard />
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard"); // Remove token from URL after storing it
    }

    fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [location.search, navigate]);

  return (
    <div className="Dashboard">
      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
        <h2>Logged In User</h2>
        {user ? (
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f4f4f4" }}>
                <th>ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.id}</td>
                <td>{user.email}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}

// 🔑 Login Popup Component
function LoginPopup({ togglePopup }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-btn" onClick={togglePopup}>&times;</span>
        <h2>Login</h2>
        <input type="email" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <label><input type="checkbox" /> Remember me</label>
        <div className="action-buttons">
          <button className="btn blue">Log in</button>
          <button className="btn green">Sign Up</button>
        </div>
        <p>Or Continue With:</p>
        <button className="social-btn google" onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}>Google</button>
        <button className="social-btn facebook">Facebook</button>
      </div>
    </div>
  );
}

LoginPopup.propTypes = {
  togglePopup: PropTypes.func.isRequired, // Ensures togglePopup is a function
};

// ✨ Main App Component
function App() {
  const [data, setData] = useState("");
  const [error, setError] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/data`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }  // ✅ Send session cookie
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => setData(data.message))
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const togglePopup = () => setShowPopup((prev) => !prev);

  return (
    <Router>
      <div className="App">
        <h1>{error ? error : data}</h1>
        <nav className={`navbar ${scrolling ? "scrolled" : ""}`}>
          <div className="logo">
            <img src="/public/final_logo.png" alt="Logo" />
          </div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/workspace">Workspace</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Plans</a></li>
          </ul>
          <div className="login">
            <button className="btn" onClick={togglePopup}>Login</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* Show popup when 'showPopup' is true */}
        {showPopup && <LoginPopup togglePopup={togglePopup} />}
      </div>
    </Router>
  );
}

export default App;
