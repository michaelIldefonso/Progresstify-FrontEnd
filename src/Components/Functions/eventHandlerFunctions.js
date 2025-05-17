import { useState, useEffect } from "react";

export const handleMenu = (event, setAnchorEl) => {
    setAnchorEl(event.currentTarget);
  };
  
  export const handleClose = (setAnchorEl) => {
    setAnchorEl(null);
  };
  
  export const toggleDrawer = (setDrawerOpen, drawerOpen) => {
    setDrawerOpen(!drawerOpen);
  };
  

export const handleWheelScroll = (e, columnsContainerRef, scrollbarRef) => {
  // Allow vertical scrolling inside card lists
  if (e.target.closest(".card-list")) {
    
    return; // Do nothing and allow the default vertical scrolling
  }

  // Horizontal scrolling logic
  if (columnsContainerRef.current && scrollbarRef.current) {
    const delta = e.deltaY; // Use vertical wheel movement to scroll horizontally
    columnsContainerRef.current.scrollLeft += delta;
    scrollbarRef.current.scrollLeft = columnsContainerRef.current.scrollLeft; // Sync scrollbarRef
    
  }
};

export const handleScrollbarScroll = (event, columnsContainerRef) => {
  if (columnsContainerRef.current) {
    columnsContainerRef.current.scrollLeft = event.target.scrollLeft;
    
  }
};

export const handleChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};


export const useTimer = (delay = 2000) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);
  return isReady;
}