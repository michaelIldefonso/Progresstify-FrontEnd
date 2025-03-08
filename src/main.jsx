import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./style.css";
import App from "./App";
import PrivateRoute from "./PrivateRoute";
import Workspace from "./Workspace";
import Home from "./home";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Workspace" element={<PrivateRoute><Workspace /></PrivateRoute>} />
      </Routes>
    </Router>
  </React.StrictMode>
);

export default Index;