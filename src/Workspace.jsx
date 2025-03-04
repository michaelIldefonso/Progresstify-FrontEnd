import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Button, TextField, Card, CardContent, Typography, IconButton, Box, Grid, Paper } from "@mui/material";
import { Dashboard, ListAlt, People, CloudUpload, Add, Delete, Close } from "@mui/icons-material";

const Workspace = () => {
    const [columns, setColumns] = useState([]);
    const [draggedCard, setDraggedCard] = useState(null);
    const [members, setMembers] = useState(["Alice", "Bob", "Charlie"]);
    const [newMember, setNewMember] = useState("");

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
        setColumns([...columns, { id: Date.now(), title: "New Column", cards: [] }]);
    };

    const removeColumn = (columnId) => {
        setColumns(columns.filter(col => col.id !== columnId));
    };

    return (
        <Box sx={{ display: "flex" }}>
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
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Button variant="contained" startIcon={<Add />} onClick={addColumn}>Add Column</Button>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {columns.map(column => (
                <Grid item key={column.id} xs={12} sm={6} md={4}>
                <Paper sx={{ padding: 2, backgroundColor: "#f4f4f4" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                    <TextField fullWidth value={column.title} onChange={(e) => 
                        setColumns(columns.map(col => col.id === column.id ? { ...col, title: e.target.value } : col))
                    } />
                    <IconButton onClick={() => removeColumn(column.id)}>
                        <Close />
                    </IconButton>
                    </Box>
                    <Button fullWidth variant="outlined" sx={{ marginTop: 1 }}>+ Add Card</Button>
                    <Box sx={{ marginTop: 2 }}>
                    {column.cards.map(card => (
                        <Card key={card.id} sx={{ marginBottom: 1 }}>
                        <CardContent>
                            <Typography>{card.text}</Typography>
                        </CardContent>
                        </Card>
                    ))}
                    </Box>
                </Paper>
                </Grid>
            ))}
            </Grid>
        </Box>
        </Box>
    );
};

export default Workspace;
