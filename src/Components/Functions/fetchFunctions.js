import axios from "axios";
import { apiClient } from "../../utils/auth";

export const fetchUserData = async (location, navigate, setUser) => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const refreshToken = urlParams.get("refreshToken");
  
  if (token) {
    localStorage.setItem("Token", token); // Ensure the correct key is used for the access token
  }
  if (refreshToken) {
    localStorage.setItem("RefreshToken", refreshToken); // Ensure the correct key is used for the refresh token
  }

  // Remove token and refreshToken from the URL
  const newUrl = location.pathname;
  window.history.replaceState({}, document.title, newUrl);

  const client = apiClient(navigate);

  try {
    const response = await client.get("/api/data");
    console.log("API Response:", response.data);
    setUser(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    navigate("/");
  }
};

export const fetchWorkspaces = async (navigate, setWorkspaces) => {
  const client = apiClient(navigate);

  try {
    const response = await client.get("/api/workspaces");
    console.log("API Response (Workspaces):", response.data);
    setWorkspaces(response.data);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    navigate("/");
  }
};