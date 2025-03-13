import { createTheme } from "@mui/material/styles";

// Function to create a theme based on dark mode
export const createCustomTheme = (darkMode) => {
  return createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1da7de",
      },
      secondary: {
        main: "#ff4081",
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff",
        paper: darkMode ? "#1e1e1e" : "#f5f5f5",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            margin: "8px 0",
            borderRadius: "24px", // Making buttons rounder
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            borderRadius: "50%", // Making checkboxes round
          },
        },
      },
    },
  });
};