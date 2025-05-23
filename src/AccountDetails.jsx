import { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography, Box, CssBaseline, GlobalStyles, Button, Avatar, IconButton, Tooltip, Badge } from "@mui/material";
import { handleLogout } from "./Components/Functions/navigationFunctions";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "./Components/Functions/fetchFunctions";
import EditIcon from "@mui/icons-material/Edit";

const DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

const AccountDetails = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  useEffect(() => { 
    let isMounted = true;
    fetchUserData(undefined, navigate, (user) => {
      if (isMounted) {
        setUser(user);
        if (user.avatarUrl) setAvatar(user.avatarUrl);
      }
    });
    return () => {
      isMounted = false;
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (!user) return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkMode ? "#0a0f1e" : "#f0f0f0",
        backgroundImage: darkMode
          ? 'url("/darkroomrtx.png")'
          : 'url("/couch1.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Typography sx={{ color: darkMode ? "#fff" : "#222" }}>Loading...</Typography>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
      <Box
        sx={{
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
        {/* Top bar for dark mode toggle */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "transparent",
            zIndex: 10,
          }}
        >
          <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              onClick={toggleDarkMode}
              sx={{
                color: "#fff",
                borderColor: "#fff",
                textTransform: "none",
                mr: 1,
                bgcolor: "rgba(30,58,138,0.25)",
                "&:hover": { bgcolor: "rgba(30,58,138,0.35)" }
              }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </Box>
        </Box>

        <Card
          sx={{
            minWidth: 350,
            p: 3,
            borderRadius: 3,
            background: darkMode
              ? "rgba(30, 58, 138, 0.35)"
              : "rgba(255,255,255,0.95)",
            border: darkMode ? "1px solid #60a5fa" : "1px solid #1976d2",
            boxShadow: "0 2px 16px rgba(30, 58, 138, 0.15)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            color: darkMode ? "#f9fafb" : "#222",
            zIndex: 2,
          }}
        >
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Tooltip title="Avatar editing coming soon!" arrow>
              <span>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <EditIcon
                      sx={{
                        bgcolor: "#e0e7ef",
                        color: "#bdbdbd",
                        borderRadius: "50%",
                        fontSize: 22,
                        p: "2px",
                        border: "2px solid #fff",
                        opacity: 0.7
                      }}
                    />
                  }
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "#1976d2",
                      fontSize: 36,
                      border: darkMode ? "2px solid #60a5fa" : "2px solid #1976d2",
                      mb: 2,
                      cursor: "not-allowed",
                      opacity: 0.85
                    }}
                    alt="User"
                    src={avatar}
                  />
                </Badge>
              </span>
            </Tooltip>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: darkMode ? "#fff" : "#1976d2" }}>
              Account Details
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Tooltip title="Editing username coming soon!" arrow>
                <span style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1">
                    <span style={{ color: "#60a5fa", fontWeight: 600 }}>Username:</span> {user.userName}
                    </Typography>
                    <EditIcon
                    sx={{
                        ml: 1,
                        color: "#bdbdbd",
                        fontSize: 20,
                        cursor: "not-allowed",
                        opacity: 0.7
                    }}
                    />
                </span>
                </Tooltip>
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>Email:</span> {user.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>ID:</span> {user.oauthId}
            </Typography>
            {/* Add more fields as needed */}
          </CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1e3a8a",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontSize: "15px",
                textTransform: "none",
                boxShadow: "0 1px 4px rgba(30,58,138,0.10)",
                "&:hover": { bgcolor: "#2563eb" }
              }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#ef4444",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontSize: "15px",
                textTransform: "none",
                boxShadow: "0 1px 4px rgba(239,68,68,0.10)",
                "&:hover": { bgcolor: "#dc2626" }
              }}
              onClick={() => handleLogout(navigate)}
            >
              Logout
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default AccountDetails;