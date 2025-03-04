import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
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
  }, [navigate, location.search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-8">
      {user ? (
        <div>
          <h1>Welcome, {user.userName}</h1>
          <p>Email: {user.userEmail}</p>
          <p>ID: {user.userId}</p>
          <p>OAuth ID: {user.userOauth_id}</p>
          <button onClick={handleLogout} className="mt-4 p-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
