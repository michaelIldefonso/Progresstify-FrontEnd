import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  return isAuthenticated ? (children || <Outlet />) : <Navigate to="/Workspace" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node
};

export default PrivateRoute;