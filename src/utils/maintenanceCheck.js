import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MAINTENANCE_ID = 1;

export const checkMaintenance = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/maintenance/${MAINTENANCE_ID}`); // Use backend base URL from environment variables
    const data = await response.json();
    return {
      isEnabled: data.is_enabled,
      message: data.message,
      estimatedEnd: data.estimated_end
    };
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    return {
      isEnabled: false,
      message: '',
      estimatedEnd: null
    };
  }
};

export const useMaintenanceCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyMaintenance = async () => {
      const { isEnabled, message, estimatedEnd } = await checkMaintenance();
      if (isEnabled) {
        navigate('/under-maintenance', { state: { message, estimatedEnd } });
      }
    };

    verifyMaintenance();
  }, [navigate]);
};
