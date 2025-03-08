import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Box,
  IconButton,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleCreateWorkspace = () => {
    navigate("/workspace");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        backgroundColor: "#0a0f1e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
                sx={{
                  color: "black",
                  textTransform: "none",
                  backgroundColor: "#30A8DB",
                  boxShadow: 3,
                }}
              >
                Account
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
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

      <Card
        onClick={handleCreateWorkspace}
        sx={{
          width: 300,
          cursor: "pointer",
          marginTop: 8,
          background: "linear-gradient(135deg, #1e3c72 30%, #2a5298 90%)",
          color: "white",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <IconButton
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              marginBottom: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <Add fontSize="large" />
          </IconButton>
          <Typography variant="h5" component="div">
            Create Workspace
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Click here to create a new workspace.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;