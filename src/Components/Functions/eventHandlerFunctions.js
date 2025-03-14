export const handleMenu = (event, setAnchorEl) => {
    setAnchorEl(event.currentTarget);
  };
  
  export const handleClose = (setAnchorEl) => {
    setAnchorEl(null);
  };
  
  export const toggleDrawer = (setDrawerOpen, drawerOpen) => {
    setDrawerOpen(!drawerOpen);
  };
  
  
