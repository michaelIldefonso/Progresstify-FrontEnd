import { AppBar, Toolbar, Button, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { handleMenu, handleClose } from "../Functions/eventHandlerFunctions";
import { handleLogout, navigateToAccountDetails } from "../Functions/navigationFunctions";
import PropTypes from "prop-types";


const AppBarWithMenu = ({ darkMode, toggleDarkMode, anchorEl, setAnchorEl, user }) => {

  const navigate = useNavigate();


  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1301,
        backgroundColor: darkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(3px)",
        boxShadow: "none",
      }}
    >
      <Toolbar>
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
              <MenuItem onClick={() => navigateToAccountDetails(navigate)}>Account Details</MenuItem>
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

// Add PropTypes validation
AppBarWithMenu.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.func.isRequired,
  user: PropTypes.object,
};
export default AppBarWithMenu;