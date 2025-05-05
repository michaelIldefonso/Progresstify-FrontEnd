import PropTypes from "prop-types"; 
import { Box } from "@mui/material";
import { handleScrollbarScroll } from "../../Functions/eventHandlerFunctions";

const CustomScrollbar = ({ columns, darkMode, drawerOpen, columnsContainerRef, scrollbarRef }) => {
  return (
    // Custom scrollbar for the columns container
    <Box
      ref={scrollbarRef}
      sx={{
        position: "fixed",
        bottom: 0,
        left: drawerOpen ? "240px" : "16px",
        right: 0,
        zIndex: 1000,
        height: "20px",
        overflowX: "auto",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": { height: "5px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: darkMode
            ? "rgba(8, 8, 8, 0.5)"
            : "rgba(255, 253, 253, 0.5)",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
      }}
      onScroll={(e) => handleScrollbarScroll(e, columnsContainerRef)} // Sync with columnsContainerRef
    >
      <Box
        sx={{
          width: `${columns.length * 266}px`, // Dynamically set the width based on the number of columns
          height: "1px",
        }}
      />
    </Box>
  );
};
// Add PropTypes for validation
CustomScrollbar.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  darkMode: PropTypes.bool.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  columnsContainerRef: PropTypes.object.isRequired,
  scrollbarRef: PropTypes.object.isRequired,
};

export default CustomScrollbar;