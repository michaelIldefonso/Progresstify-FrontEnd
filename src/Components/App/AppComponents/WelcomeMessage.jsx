import { Typography } from "@mui/material";
import PropTypes from "prop-types"; // Import PropTypes

function WelcomeMessage({ darkMode }) {
  return (
    // style for intro welcome message
    <Typography
      variant="div"
      align="center"
      style={{
        marginTop: "20px",
        paddingTop: 0,
        position: "absolute",
        top: "10%",
        backgroundColor: darkMode ? "rgba(84, 109, 247, 0.1)" : "rgba(255, 218, 52, 0.1)",
        color: darkMode ? "rgba(13, 17, 37)" : "rgba(87,40,20,255)",
        width: "80%",
        maxWidth: "600px",
        borderRadius: "16px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "13px",
      }}
    >
      <h1>Welcome to Progresstify</h1>
      <p>
        Progresstify helps you stay organized. Create boards, lists, and cards
        to manage tasks visually. Prioritize tasks, set deadlines, and track
        progress in real-time. Manage your projects efficiently with
        Progresstify!
      </p>
    </Typography>
  );
}

WelcomeMessage.propTypes = {
  darkMode: PropTypes.bool.isRequired, // Validate darkMode as a required boolean
};
export default WelcomeMessage;