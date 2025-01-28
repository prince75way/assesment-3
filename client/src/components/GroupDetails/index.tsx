import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Link, Button } from "@mui/material";
import InviteLinkModal from "../../components/InviteLink";  // Import the InviteLinkModal component

interface GroupDetailsProps {
  selectedGroup: {
    name: string;
    description: string;
    inviteLink: string;
    members: { name: string; email: string }[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    _id: string;  // Group ID
  } | null;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ selectedGroup }) => {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  if (!selectedGroup) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No Group Selected</Typography>
      </Box>
    );
  }

  const handleOpenInviteModal = () => setInviteModalOpen(true);
  const handleCloseInviteModal = () => setInviteModalOpen(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {selectedGroup.name}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Description:</strong> {selectedGroup.description}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Invite Link:</strong>
      </Typography>
      <Link href={selectedGroup.inviteLink} target="_blank" rel="noopener noreferrer">
        {selectedGroup.inviteLink}
      </Link>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1" gutterBottom>
        <strong>Created At:</strong> {new Date(selectedGroup.createdAt).toLocaleString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Created By:</strong> {selectedGroup.createdBy}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Last Updated:</strong> {new Date(selectedGroup.updatedAt).toLocaleString()}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1" gutterBottom>
        <strong>Members:</strong>
      </Typography>
      <List>
        {selectedGroup.members.map((member, index) => (
          <ListItem key={index}>
            <ListItemText primary={member.name} secondary={member.email} />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenInviteModal}
        sx={{ mt: 2 }}
      >
        Send Invite
      </Button>

      {/* Invite Modal */}
      <InviteLinkModal
        open={isInviteModalOpen}
        handleClose={handleCloseInviteModal}
        groupId={selectedGroup._id}  // Passing group ID as a prop
      />
    </Box>
  );
};

export default GroupDetails;
