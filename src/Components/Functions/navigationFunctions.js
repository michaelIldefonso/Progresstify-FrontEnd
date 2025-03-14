export const handleLogout = (navigate) => {
    localStorage.removeItem("token");
    navigate("/"); // Navigate to login
  };

export const navigateHome = (navigate) => {
    navigate("/workspace"); // Navigate to home
  };