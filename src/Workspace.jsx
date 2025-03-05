import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Button, TextField, Card, CardContent, Typography, IconButton, Box, Grid, Paper } from "@mui/material";
import { Dashboard, ListAlt, People, CloudUpload, Add, Delete, Close, DeleteForever } from "@mui/icons-material";

const Workspace = () => {
    const [columns, setColumns] = useState([]);
    const [newMember, setNewMember] = useState("");
    const [members, setMembers] = useState(["Alice", "Bob", "Charlie"]);
    const [draggingColumn, setDraggingColumn] = useState(null);

    const addMember = () => {
        if (newMember.trim() && !members.includes(newMember)) {
            setMembers([...members, newMember]);
            setNewMember("");
        }
    };

    const removeMember = (name) => {
        setMembers(members.filter(member => member !== name));
    };

    const addColumn = () => {
        setColumns([...columns, { id: Date.now(), title: "", isEditing: true, cards: [], newCardText: "" }]);
    };

    const renameColumn = (columnId, newTitle) => {
        setColumns(columns.map(col => 
            col.id === columnId ? { ...col, title: newTitle } : col
        ));
    };

    const finalizeColumnTitle = (columnId) => {
        setColumns(columns.map(col =>
            col.id === columnId && col.title.trim() ? { ...col, isEditing: false } : col
        ));
    };

    const addCard = (columnId) => {
        setColumns(columns.map(col => {
            if (col.id === columnId && col.newCardText.trim()) {
                return { 
                    ...col, 
                    cards: [...col.cards, { id: Date.now(), text: col.newCardText }],
                    newCardText: "" 
                };
            }
            return col;
        }));
    };

    const removeCard = (columnId, cardId) => {
        setColumns(columns.map(col => {
            if (col.id === columnId) {
                return { ...col, cards: col.cards.filter(card => card.id !== cardId) };
            }
            return col;
        }));
    };

    const handleCardInputChange = (columnId, text) => {
        setColumns(columns.map(col => col.id === columnId ? { ...col, newCardText: text } : col));
    };

    const handleCardInputKeyPress = (event, columnId) => {
        if (event.key === "Enter") {
            addCard(columnId);
        }
    };

    const handleColumnDragStart = (event, columnId) => {
        setDraggingColumn(columnId);
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (event, targetColumnId) => {
        event.preventDefault();
        const columnId = draggingColumn;
        if (columnId && columnId !== targetColumnId) {
            setColumns(columns.map(col => col.id === columnId ? { ...col, cards: col.cards.filter(c => c.id !== card.id) } : col));
            setColumns(columns.map(col => col.id === targetColumnId ? { ...col, cards: [...col.cards, card] } : col));
        }
        setDraggingColumn(null);
    };

    const handleTrashDrop = (event) => {
        event.preventDefault();
        const columnId = draggingColumn;
        setColumns(columns.filter(col => col.id !== columnId));
        setDraggingColumn(null);
    };

    return (
        <Box sx={{ display: "flex", position: "relative" }}>
            <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
                <List>
                    {["Dashboard", "Board List", "Member List", "Uploads"].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {[<Dashboard />, <ListAlt />, <People />, <CloudUpload />][index]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h6">Manage Members</Typography>
                    <TextField
                        fullWidth
                        label="New Member"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        size="small"
                        sx={{ marginBottom: 1 }}
                    />
                    <Button variant="contained" fullWidth startIcon={<Add />} onClick={addMember}>Add</Button>
                    <List>
                        {members.map(member => (
                            <ListItem key={member} secondaryAction={
                                <IconButton edge="end" onClick={() => removeMember(member)}>
                                    <Delete />
                                </IconButton>
                            }>
                                <ListItemText primary={member} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box sx={{ flexGrow: 1, padding: 3, marginLeft: "100px" }}>
                <Button variant="contained" startIcon={<Add />} onClick={addColumn}>Add Column</Button>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {columns.map(column => (
                        <Grid 
                            item key={column.id} xs={12} sm={6} md={4} 
                            onDrop={(e) => handleDrop(e, column.id)} 
                            onDragOver={(e) => e.preventDefault()}
                            draggable onDragStart={(e) => handleColumnDragStart(e, column.id)}
                        >
                            <Paper sx={{ padding: 2, backgroundColor: "#f4f4f4" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    {column.isEditing ? (
                                        <TextField 
                                            fullWidth 
                                            placeholder="Enter column name" 
                                            value={column.title} 
                                            onChange={(e) => renameColumn(column.id, e.target.value)}
                                            onBlur={() => finalizeColumnTitle(column.id)}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    finalizeColumnTitle(column.id);
                                                    e.preventDefault();
                                                }
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <Typography variant="h6" onClick={() => setColumns(columns.map(col =>
                                            col.id === column.id ? { ...col, isEditing: true } : col
                                        ))}>
                                            {column.title || "Untitled Column"}
                                        </Typography>
                                    )}
                                    <IconButton onClick={() => setColumns(columns.filter(col => col.id !== column.id))}>
                                        <Close />
                                    </IconButton>
                                </Box>
                                <TextField 
                                    fullWidth 
                                    placeholder="Enter card text and press Enter" 
                                    value={column.newCardText} 
                                    onChange={(e) => handleCardInputChange(column.id, e.target.value)}
                                    onKeyPress={(e) => handleCardInputKeyPress(e, column.id)}
                                    sx={{ marginTop: 1 }}
                                />
                                <Box sx={{ marginTop: 2 }}>
                                    {column.cards.map(card => (
                                        <Card key={card.id} sx={{ marginBottom: 1 }} draggable onDragStart={(e) => handleDragStart(e, card, column.id)}>
                                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography>{card.text}</Typography>
                                                <IconButton edge="end" onClick={() => removeCard(column.id, card.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                <Box 
                    sx={{ 
                        position: "fixed", 
                        right: 16, 
                        bottom: 16, 
                        backgroundColor: "red", 
                        color: "#fff", 
                        borderRadius: "50%", 
                        width: 56, 
                        height: 56, 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center" 
                    }}
                    onDrop={handleTrashDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <DeleteForever fontSize="large" />
                </Box>
            </Box>
        </Box>
    );
};

export default Workspace;