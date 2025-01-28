import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Skeleton } from "@mui/material";
import { useGroupbyIdQuery, useJoinGroupMutation } from "../services/api"; // Assuming these queries are in your API slice
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import the CSS for Toastify

const JoinGroupPage: React.FC = () => {
  const { groupId } = useParams(); // Extract the groupId from the URL
  const navigate = useNavigate();
  const [joinGroup] = useJoinGroupMutation(); 
  const { data: group, isLoading, isError } = useGroupbyIdQuery({ id: groupId || "" }); // Fetch group data based on groupId
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedLoading(false);
    }, 5000); 
    return () => clearTimeout(timer);
  }, []);

  // Debugging: Log the groupId to check if it's being passed correctly
  // console.log("Group ID:", groupId);
  // console.log("data:", group);

  // Check if groupId is missing
  if (!groupId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No group ID provided in the URL.</Typography>
      </Box>
    );
  }

  // If groupId is provided but fetching group fails
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Failed to load group details</Typography>
      </Box>
    );
  }

  // If group is still loading, show loading state
  if (delayedLoading || isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Skeleton variant="text" width={200} height={40} sx={{ marginBottom: 2 }} />
        <Skeleton variant="text" width={300} height={20} sx={{ marginBottom: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ marginBottom: 2 }} />
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading group details...
        </Typography>
      </Box>
    );
  }

 

  // Handle the join group action
  const handleJoinGroup = async () => {
    try {
      await joinGroup({
        groupId: groupId,
        inviteLink: `http://localhost:5173/join-group/${groupId}`
      }).unwrap();

      toast.success("Successfully joined the group!");
      navigate("/");
    } catch (error) {
      console.error("Failed to join the group:", error);
      toast.error("Failed to join the group. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {group?.data.name}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Description:</strong> {group?.data.description}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>Members:</strong>
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Do you want to join this group?</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleJoinGroup}
        >
          Yes, Join Group
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, ml: 2 }}
          onClick={() => navigate("/")}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default JoinGroupPage;

