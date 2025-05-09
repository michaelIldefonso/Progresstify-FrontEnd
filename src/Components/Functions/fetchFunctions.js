import axios from "axios";

export const fetchUserData = async (location, navigate, setUser) => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  if (token) {
    localStorage.setItem("token", token);
  }

  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    console.error("No token found, redirecting...");
    navigate("/");
    return;
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    console.log("API Response:", response.data);
    setUser(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    navigate("/");
  }
};

export const fetchWorkspaces = async (navigate, setWorkspaces) => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    console.error("No token found, redirecting...");
    navigate("/");
    return;
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/workspaces`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    console.log("API Response (Workspaces):", response.data);
    setWorkspaces(response.data);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    navigate("/");
  }
};