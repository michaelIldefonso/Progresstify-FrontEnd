import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Board from "./board";
import Workspace from "./workspace";
import Dashboard from "./dashboard";
import AccountDetails from "./AccountDetails";
import UnderMaintenance from './UnderMaintenance';
import { useMaintenanceCheck } from "./utils/maintenanceCheck";

const AppRoutes = () => {
  const isUnderMaintenance = useMaintenanceCheck(); // returns true/false or null for loading

  if (isUnderMaintenance === null) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (isUnderMaintenance) {
    return <Navigate to="/under-maintenance" />;
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/workspace" element={<Workspace />} />
      <Route path="/dashboard/:workspaceId" element={<Dashboard />} />
      <Route path="/board/:id" element={<Board />} />
      <Route path="/accountDetails" element={<AccountDetails />} />
      <Route path="/under-maintenance" element={<UnderMaintenance />} />
    </Routes>
  );
};

export default AppRoutes;