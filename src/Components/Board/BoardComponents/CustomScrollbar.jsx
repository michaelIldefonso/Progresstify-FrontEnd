import React, { useRef } from "react";
import { Box } from "@mui/material";
import { handleScrollbarScroll } from "../../Functions/eventHandlerFunctions";

const CustomScrollbar = ({ columns, darkMode, drawerOpen }) => {
  const scrollbarRef = useRef(null);
  const columnsContainerRef = useRef(null);

  return (
    <Box ref={scrollbarRef} sx={{ position: "fixed", bottom: 0, left: drawerOpen ? "240px" : "16px", right: 0, zIndex: 1000, height: "20px", overflowX: "auto", scrollbarWidth: "thin", "&::-webkit-scrollbar": { height: "5px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: darkMode ? "rgba(8, 8, 8, 0.5)" : "rgba(255, 253, 253, 0.5)", borderRadius: "8px" }, "&::-webkit-scrollbar-track": { backgroundColor: "transparent" } }} onScroll={(e) => handleScrollbarScroll(e, columnsContainerRef)}>
      <Box sx={{ width: columns.length * 266 + 'px', height: '1px' }} />
    </Box>
  );
};

export default CustomScrollbar;