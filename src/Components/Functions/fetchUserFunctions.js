import axios from "axios";
export const fetchUserData = (location, navigate, setUser) => {
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
  