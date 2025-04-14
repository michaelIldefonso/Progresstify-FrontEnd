import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import Board from "./board";
import Workspace from "./workspace";
import Dashboard from "./dashboard";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/dashboard/:workspaceId" element={<Dashboard />} />    
        <Route path="/board/:id" element={<Board />} />{/* Route for specific dashboard */}    
    </Routes>
  );
};

export default AppRoutes;