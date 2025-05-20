import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css'; // Add any specific styles for the maintenance page
import { checkMaintenance } from './utils/maintenanceCheck';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

const UnderMaintenance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, estimatedEnd } = location.state || {};

  useEffect(() => {
    const verifyMaintenance = async () => {
      const { isEnabled } = await checkMaintenance();
      if (!isEnabled) {
        localStorage.removeItem('Token');
        localStorage.removeItem('RefreshToken');
        navigate('/');
      }
    };

    const interval = setInterval(verifyMaintenance, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          textAlign: 'center',
          maxWidth: 600,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" gutterBottom>
          We&apos;ll Be Back Soon!
        </Typography>
        <Typography variant="body1" gutterBottom>
          {message || 'Our site is currently undergoing scheduled maintenance. Thank you for your patience.'}
        </Typography>
        {estimatedEnd && (
          <Typography variant="body2" color="textSecondary">
            Estimated End Time: {new Date(estimatedEnd).toLocaleString()}
          </Typography>
        )}
        <Box sx={{ marginTop: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    </Box>
  );
};

export default UnderMaintenance;
