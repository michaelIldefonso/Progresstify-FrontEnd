// Handles user logout by removing the authentication token and navigating to the login page
export const handleLogout = (navigate) => {
    localStorage.removeItem("token");
    navigate("/"); // Navigate to login
  };

// Navigates the user to the home/workspace page
export const navigateHome = (navigate) => {
    navigate("/workspace"); // Navigate to home
  };