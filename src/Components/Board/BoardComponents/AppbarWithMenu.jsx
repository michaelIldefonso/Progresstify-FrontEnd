import React from "react";
import { AppBar, Toolbar, Button, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toggleDrawer, handleMenu, handleClose } from "../../Functions/eventHandlerFunctions";
import { handleLogout } from "../../Functions/navigationFunctions";

const AppBarWithMenu = ({ darkMode, setDarkMode, anchorEl, setAnchorEl, user, drawerOpen, setDrawerOpen }) => {
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1301, backgroundColor: darkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
     backdropFilter: "blur(3px)", boxShadow: "none", }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(setDrawerOpen, drawerOpen)} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}> 
          <p>Progresstify</p>
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/workspace")}
          sx={{ color: darkMode ? "white" : "black", textTransform: "none" }}
        >
          Home
        </Button>
        {user && (
          <div>
            <Button
              variant="outlined"
              onClick={(e) => handleMenu(e, setAnchorEl)}
              sx={{ color: darkMode ? "white" : "black", textTransform: "none" }}
            >
              Account
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={() => handleClose(setAnchorEl)}
            >
              <MenuItem disabled>{`Email: ${user.userEmail}`}</MenuItem>
              <MenuItem disabled>{`ID: ${user.userId}`}</MenuItem>
              <MenuItem disabled>{`OAuth ID: ${user.userOauth_id}`}</MenuItem>
              <MenuItem onClick={() => handleLogout(navigate)}>Logout</MenuItem>
            </Menu>
          </div>
        )}
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarWithMenu;