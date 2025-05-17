export const handleLogout = (navigate) => {
    localStorage.removeItem("Token");
    localStorage.removeItem("RefreshToken");
    navigate("/"); // Navigate to login
  };

export const navigateHome = (navigate) => {
    navigate("/workspace"); // Navigate to home
  };

export const navigateToAccountDetails = (navigate) => {
    navigate("/accountDetails"); // Navigate to account details
  };