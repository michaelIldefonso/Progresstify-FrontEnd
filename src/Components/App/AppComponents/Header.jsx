import { Button, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PropTypes from "prop-types"; // Import PropTypes

function Header({ darkMode, toggleDarkMode, setOpen }) {
  return (
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
        <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? "#fff" : "#000" }}>
          {darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            color: darkMode ? "#2196F3" : "#000",
            borderColor: darkMode ? "#2196F3" : "#000",
            textTransform: "none",
            marginLeft: "10px",
            marginRight: "20px",
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