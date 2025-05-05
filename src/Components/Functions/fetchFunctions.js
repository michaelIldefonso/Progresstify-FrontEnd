import axios from "axios";// Importing Axios, a promise-based HTTP client for making API requests

// Fetches user data from the API and updates the user state
export const fetchUserData = (location, navigate, setUser) => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    // Store token in localStorage if found in URL
    if (token) {
      localStorage.setItem("token", token);
    }
  
    const storedToken = localStorage.getItem("token");

    // Redirect to home page if no token is found
    if (!storedToken) {
      console.error("No token found, redirecting...");
      navigate("/");
      return;
    }

    // Make an API request to fetch user data
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, { 
      withCredentials: true,
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((response) => {
        console.log("API Response:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/");
      });
  };

  // Fetches workspaces from the API and updates the workspaces state
  export const fetchWorkspaces = (navigate, setWorkspaces) => {
    const storedToken = localStorage.getItem("token");
  
    // Redirect to home page if no token is found
    if (!storedToken) {
      console.error("No token found, redirecting...");
      navigate("/");
      return;
    }
  
     // Make an API request to fetch workspaces
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/workspaces`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log("API Response (Workspaces):", response.data);
        setWorkspaces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workspaces:", error);
        navigate("/");
      });
  };
