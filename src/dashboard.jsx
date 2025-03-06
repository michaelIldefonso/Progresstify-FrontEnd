import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Menu, MenuItem, Typography, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Dashboard = () => {
const [user, setUser] = useState(null);
const [anchorEl, setAnchorEl] = useState(null);
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

const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
};

return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <AppBar position="absolute" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
            <img src="/hahaha.png" alt="Sitemark" />
        </Typography>
        {user && (
            <div>
            <Button
                variant="outlined"
                onClick={handleMenu}
                sx={{ color: "#2196F3", borderColor: "#2196F3", textTransform: "none" }}
            >
                Account
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem disabled>{`Email: ${user.userEmail}`}</MenuItem>
                <MenuItem disabled>{`ID: ${user.userId}`}</MenuItem>
                <MenuItem disabled>{`OAuth ID: ${user.userOauth_id}`}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
            </div>
        )}
        </Toolbar>
    </AppBar>
    <div className="p-8">
        {user ? (
        <div>
            <h1 style={{ color: "#fff"}}>Welcome, {user.userName}</h1>
        </div>
        ) : (
        <p>Loading...</p>
        )}
    </div>
    </div>
);
};

export default Dashboard;