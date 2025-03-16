import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./style.css";
import App from "./App";
import PrivateRoute from "./PrivateRoute";
import Board from "./board";
import Workspace from "./workspace";
import Dashboard from "./dashboard"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/workspaces/:workspaceId/boards" element={<Board />} /> {/* Route for specific board */}
        <Route path="/board/:id" element={<Board />} />{/* Route for specific dashboard */}
        <Route path="/dashboard/:workspaceId" element={<Dashboard />} />        
        
      </Routes>
    </Router>
  </React.StrictMode>
);