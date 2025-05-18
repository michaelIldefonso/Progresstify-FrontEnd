import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CssBaseline, GlobalStyles, Button, Avatar } from "@mui/material";
import { handleLogout } from "./Components/Functions/navigationFunctions";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "./Components/Functions/fetchFunctions";

const AccountDetails = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => { 
        let isMounted = true;
        fetchUserData(undefined, navigate, (user) => {
          if (isMounted) setUser(user);
        });
        return () => {
          isMounted = false;
        }
    }, [navigate]); // Removed 'location' from dependencies

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <>
        <CssBaseline />
        <GlobalStyles styles={{ body: { backgroundColor: "#f5f5f5" } }} />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card sx={{ minWidth: 350, p: 2, borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar
                    sx={{ width: 80, height: 80, mb: 2, bgcolor: "#1976d2", fontSize: 36 }}
                    alt="User"
                    src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                >
                </Avatar>
                <Typography variant="h5" gutterBottom>
                    Account Details
                </Typography>
                <Typography variant="body1">{`Email: ${user.email}`}</Typography>
                <Typography variant="body1">{`ID: ${user.oauthId}`}</Typography>
                {/* Add more fields as needed */}
            </CardContent>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                navigate(-1);
            }}>
                Go Back
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                handleLogout(navigate);
                }}
            >
                Logout
            </Button>
            </Card>
        </Box>
        </>
    );
}

export default AccountDetails;