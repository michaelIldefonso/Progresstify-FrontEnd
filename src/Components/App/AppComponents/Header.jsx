import { Button, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PropTypes from "prop-types"; 

function Header({ darkMode, toggleDarkMode, setOpen }) {
  return (
    // Positioning the buttons at the top right of the page
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Dark mode toggle button */}
        <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? "#fff" : "#000" }}>
          {darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        {/* Login / Sign Up button */}
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            color: darkMode ? "#2196F3" : "#000",
            borderColor: darkMode ? "#2196F3" : "#000",
            textTransform: "none",
            marginLeft: "10px",
            marginRight: "20px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          Login / Sign Up
        </Button>
      </div>
    </div>
  );
}
// Add PropTypes for validation
Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
};
export default Header;