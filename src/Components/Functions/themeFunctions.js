import { createTheme } from "@mui/material/styles";
import { useEffect } from "react";

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
            borderRadius: "24px", 
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            borderRadius: "50%", 
          },
        },
      },
    },
  });
};

// Custom React hook to persist the state of dark mode in localStorage whenever it changes
export const useDarkModeEffect = (darkMode) => {
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
};
