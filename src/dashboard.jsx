import React, { useState, useEffect } from "react";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Paper, Button, TextField, Modal
} from "@mui/material";
import { Add, Dashboard as DashboardIcon, Brightness4, Brightness7, Edit } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

const Dashboard = () => {
  const { id } = useParams(); // Get the id from the route parameters
  const [darkMode, setDarkMode] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [editingDashboardId, setEditingDashboardId] = useState(null);
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState(""); // Added description state
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    // Load dashboards from localStorage on component mount
    const savedDashboards = JSON.parse(localStorage.getItem("dashboards")) || [];
    setDashboards(savedDashboards);

    // Set the active dashboard if id is present in the route
    if (id) {
      const active = savedDashboards.find(d => d.id === parseInt(id));
      setActiveDashboard(active);
    }
  }, [id]);

  useEffect(() => {
    // Save dashboards to localStorage whenever the dashboards state changes
    localStorage.setItem("dashboards", JSON.stringify(dashboards));
  }, [dashboards]);

  const theme = createTheme({
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
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const createDashboard = () => {
    const newDashboard = { id: Date.now(), name: dashboardName, description: dashboardDescription };
    setDashboards(prevDashboards => {
      const updatedDashboards = [newDashboard, ...prevDashboards];
      localStorage.setItem("dashboards", JSON.stringify(updatedDashboards)); // Save immediately to localStorage
      return updatedDashboards;
    });
    setDashboardName("");
    setDashboardDescription("");
    setModalOpen(false); // Close modal after creating dashboard
     // Redirect to the specific dashboard
  };

  const selectDashboard = (dashboard) => {
    setActiveDashboard(dashboard);
    setEditingDashboardId(null);
    navigate(`/dashboard/${dashboard.id}`); // Redirect to the specific dashboard
  };

  const handleEditClick = (dashboard) => {
    setEditingDashboardId(dashboard.id);
    setDashboardName(dashboard.name);
    setDashboardDescription(dashboard.description);
  };

  const handleNameChange = (e) => {
    setDashboardName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDashboardDescription(e.target.value);
  };

  const handleNameSave = (dashboard) => {
    setDashboards(dashboards.map(d => d.id === dashboard.id ? { ...d, name: dashboardName, description: dashboardDescription } : d));
    setEditingDashboardId(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          backgroundImage: darkMode ? 'url("/stary.jpg")' : 'url("/cloud.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", pt: 2 }}>
            <img src="/hahaha.png" alt="Sitemark" style={{ width: '100px', height: '100px' }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
              <Typography variant="h6" sx={{ }}>
                {darkMode ? "Dark Mode" : "Light Mode"}
              </Typography>
            </Box>
          </Box>
          <List>
            {dashboards.map((dashboard) => (
              <ListItem
                button
                key={dashboard.id}
                onClick={() => selectDashboard(dashboard)}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                {editingDashboardId === dashboard.id ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <TextField
                      value={dashboardName}
                      onChange={handleNameChange}
                      onBlur={() => handleNameSave(dashboard)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSave(dashboard)}
                      autoFocus
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      value={dashboardDescription}
                      onChange={handleDescriptionChange}
                      onBlur={() => handleNameSave(dashboard)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSave(dashboard)}
                      multiline
                      rows={2}
                    />
                  </Box>
                ) : (
                  <ListItemText primary={dashboard.name} secondary={dashboard.description} />
                )}
                <IconButton onClick={() => handleEditClick(dashboard)}>
                  <Edit />
                </IconButton>
              </ListItem>
            ))}
            <ListItem button onClick={() => setModalOpen(true)}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Create Dashboard" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            minHeight: "100vh",
          }}
        >
          {activeDashboard ? (
            <Typography variant="h4">Dashboard: {activeDashboard.name}</Typography>
          ) : (
            <Paper
              elevation={3}
              sx={{
                p: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Select or Create a Dashboard</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setModalOpen(true)}
                sx={{ mt: 2 }}
              >
                Create Dashboard
              </Button>
            </Paper>
          )}
        </Box>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              padding: 4,
            }}
          >
            <Typography variant="h6">Create Dashboard</Typography>
            <TextField
              label="Dashboard Name"
              fullWidth
              value={dashboardName}
              onChange={handleNameChange}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={dashboardDescription}
              onChange={handleDescriptionChange}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={createDashboard}
              sx={{ mt: 2 }}
            >
              Create
            </Button>
          </Paper>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;