
import { apiClient } from "../../utils/auth";

// Extract and store tokens from URL if present
export const extractAndStoreTokens = (location) => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const refreshToken = urlParams.get("refreshToken");
  if (token && refreshToken) {
    localStorage.setItem("Token", token);
    localStorage.setItem("RefreshToken", refreshToken);
  }
  // Clean up the URL by removing query parameters
  const newUrl = location.pathname;
  window.history.replaceState({}, document.title, newUrl);
};

export const fetchUserData = async (location, navigate, setUser) => {
  try {
    // Initialize API client
    const client = apiClient(navigate);

    // Fetch user data
    const response = await client.get("/api/data");
    console.log("API Response:", response.data);

    // Update user state
    setUser(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    navigate("/");
  }
};