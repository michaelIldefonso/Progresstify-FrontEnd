import { apiClient } from "../../utils/auth";

export const fetchUserData = async (location, navigate, setUser) => {
  try {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const refreshToken = urlParams.get("refreshToken");
    console.log("Token:", token);
    console.log("Refresh Token:", refreshToken);

    // Clean up the URL by removing query parameters
    const newUrl = location.pathname;
    window.history.replaceState({}, document.title, newUrl);

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