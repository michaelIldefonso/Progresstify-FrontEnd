import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => { // PrivateRoute component
  const isAuthenticated = Boolean(localStorage.getItem("token")); // Check if the user is authenticated
  return isAuthenticated ? (children || <Outlet />) : <Navigate to="/Workspace" />; // Render the children if authenticated, else redirect to login
};

PrivateRoute.propTypes = { 
  children: PropTypes.node 
};

export default PrivateRoute;