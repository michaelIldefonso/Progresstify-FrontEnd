import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./style.css";
import App from "./App";
import PrivateRoute from "./PrivateRoute";
import Board from "./board"; // Ensure this file is correct
import Home from "./home";
import Dashboard from "./dashboard"; // Ensure this file is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/workspaces/:workspaceId/boards" element={<Board />} />
        <Route path="/dashboard/:id" element={<Board />} />{/* Route for specific dashboard */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Route for Dashboard */}
        
        
      </Routes>
    </Router>
  </React.StrictMode>
);