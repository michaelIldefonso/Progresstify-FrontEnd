import { useState, useEffect } from "react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import Header from "./Components/App/AppComponents/Header";
import WelcomeMessage from "./Components/App/AppComponents/WelcomeMessage";
import AuthDialog from "./Components/App/AppComponents/AuthDialog";

function App() {
  // State for controlling the auth dialog open/close
  const [open, setOpen] = useState(false);
  // State for tracking whether the auth dialog is for sign-up or login
  const [isSignUp, setIsSignUp] = useState(false);

  // State for tracking dark mode; initial value is fetched from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });

  // Effect to persist dark mode preference in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

    // Function to toggle dark mode on/off
  const toggleDarkMode = () => setDarkMode(!darkMode);
  return (
    <div>

       {/* CssBaseline resets browser-specific styles */}
      <CssBaseline />

       {/* Adding global styles to hide scrollbars */}

      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />

        {/* Main container with dynamic styles */}
      <div
        style={{
          backgroundColor: darkMode ? "#0a0f1e" : "#f0f0f0",
          backgroundImage: darkMode
            ? 'url("/darkroomrtx.png")'
            : 'url("/couch1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
         {/* Header component with props for dark mode and dialog control */}
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          setOpen={setOpen}
        />

         {/* Welcome message component with dark mode styling */}
        <WelcomeMessage darkMode={darkMode} />

        
        {/* Auth dialog component for user authentication */}
        <AuthDialog
          open={open}
          setOpen={setOpen}
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

export default App;