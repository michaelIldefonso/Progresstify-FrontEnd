import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import Column from "./Column";
import { handleAddColumn, handleColumnsScroll } from "../BoardFunctions/columnFunctions";

const ColumnList = ({ id, columns, setColumns, draggingCard, setDraggingCard, draggingColumn, setDraggingColumn, darkMode, drawerOpen }) => {
  const columnsContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  return (
    <Box sx={{ flexGrow: 1, padding: 3, marginLeft: drawerOpen ? "240px" : "16px", marginTop: "140px", transition: "margin-left 0.3s", overflow: "hidden" }}>
      <div style={{ height: "calc(100% - 60px)", overflow: "hidden" }}>
        <Box sx={{ position: "fixed", top: "120px", left: drawerOpen ? "240px" : "16px", zIndex: 1200, transition: "left 0.3s" }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleAddColumn(id, columns, setColumns, columnsContainerRef)} sx={{ borderRadius: "24px", marginLeft: "24px" }}>
            Add Column
          </Button>
        </Box>
        <Box ref={columnsContainerRef} sx={{ display: "flex", overflowX: "auto", height: "100%", paddingTop: 2, "&::-webkit-scrollbar": { display: "none" }, "-ms-overflow-style": "none", "scrollbar-width": "none" }} onScroll={(e) => handleColumnsScroll(e, scrollbarRef)}>
          {columns.map((column) => (
            <Column key={column.id} column={column} id={id} columns={columns} setColumns={setColumns} draggingCard={draggingCard} setDraggingCard={setDraggingCard} draggingColumn={draggingColumn} setDraggingColumn={setDraggingColumn} darkMode={darkMode} />
          ))}
        </Box>
      </div>
    </Box>
  );
};

export default ColumnList;