import { useState, useEffect } from "react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import Header from "./Components/App/AppComponents/Header";
import WelcomeMessage from "./Components/App/AppComponents/WelcomeMessage";
import AuthDialog from "./Components/App/AppComponents/AuthDialog";


function App() {
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div>
      <CssBaseline />
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
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
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          setOpen={setOpen}
        />
        <WelcomeMessage darkMode={darkMode} />
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