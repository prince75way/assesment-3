import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Adjust the path to your store definition
import { Card, CardContent, Typography, Box, Alert } from "@mui/material";

const Dashboard: React.FC = () => {
  // Access user state from Redux
  const { user, isAuthenticated: isUserAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  // Check if the user is authenticated
  if (!isUserAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Alert severity="error" sx={{ width: 400, textAlign: "center", color: "black" }}>
          You are not logged in. Please log in to view your dashboard.
        </Alert>
      </Box>
    );
  }

  // Display the user data
  const dashboardData = { title: "User Dashboard", entity: user };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        sx={{
          width: 400,
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            {dashboardData.title}
          </Typography>
          {dashboardData.entity && (
            <>
              <Typography
                variant="body1"
                component="p"
                sx={{ marginBottom: 1, color: "text.secondary" }}
              >
                <strong>Name:</strong> {dashboardData.entity.name}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                sx={{ color: "text.secondary" }}
              >
                <strong>Email:</strong> {dashboardData.entity.email}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
