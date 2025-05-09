import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers"; // Import LocalizationProvider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import Day.js adapter
import "./style.css";
import AppRoutes from "./Routes"; // Import the separated routes

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> is used to highlight potential problems in an application
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <AppRoutes />
      </Router>
    </LocalizationProvider>
  </React.StrictMode>
);