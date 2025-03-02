import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./style.css";
import PropTypes from "prop-types";
import KanbanBoard from "./Workspace";
import "./workspace.css";

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
        <button className="social-btn google" onClick={() => window.location.href = "https://progresstify.onrender.com/auth/google"}>Google</button>
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
    fetch("https://progresstify.onrender.com/api/data")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setData(data?.message))
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const togglePopup = () => setShowPopup((prev) => !prev);

  return (
    <Router>
      <div className="App">
      <h1>{error || data }</h1>

        <nav className={`navbar ${scrolling ? "scrolled" : ""}`}>
          <div className="logo">
            <img src="/final_logo.png" alt="Logo" />
          </div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/workspace">Workspace</Link></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Pricing</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Plans</a></li>
          </ul>
          <div className="login">
            <button className="btn" onClick={togglePopup}>Login</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workspace" element={<Workspace />} />
        </Routes>

        {/* Show popup when 'showPopup' is true */}
        {showPopup && <LoginPopup togglePopup={togglePopup} />}
      </div>
    </Router>
  );
}

export default App;
