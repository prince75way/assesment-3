import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

interface Group {
  _id: string;
  name: string;
  inviteLink: string;
  members: { name: string; email: string }[];
}

interface GroupsListProps {
  groups: { groups: Group[] }; // Adjusted to reflect groups.groups
  selectedGroup: Group | null;
  onSelectGroup: (group: Group) => void;
}

const GroupsList: React.FC<GroupsListProps> = ({ groups, selectedGroup, onSelectGroup }) => {
  // Access the correct array path
  const groupArray = groups.groups || [];
  const isValidGroupsArray = Array.isArray(groupArray);

  // console.log("groups in list page si: ", groupArray); // Now correctly logging the array

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Groups
      </Typography>

      {!isValidGroupsArray || groupArray.length === 0 ? (
        <Typography variant="body1">No groups available</Typography> // Display message if no groups
      ) : (
        <List>
          {groupArray.map((group) => (
            <ListItem
              key={group._id}
              component="button"
              onClick={() => onSelectGroup(group)}
              sx={{
                backgroundColor: selectedGroup?._id === group._id ? "lightblue" : "transparent",
                "&:hover": { backgroundColor: "lightgray" },
              }}
            >
              <ListItemText primary={group.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default GroupsList;
