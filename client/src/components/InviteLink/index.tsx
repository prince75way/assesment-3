import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useInviteUserMutation } from "../../services/api";  // Assuming you have a mutation for sending the invite
import { toast } from 'react-toastify';
interface InviteLinkModalProps {
  open: boolean;
  handleClose: () => void;
  groupId: string;  // Group ID passed as a prop
}

const InviteLinkModal: React.FC<InviteLinkModalProps> = ({ open, handleClose, groupId }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendInvite] = useInviteUserMutation();  // Assuming this mutation sends the invite

  const handleSendInvite = async () => {
    if (!email) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Send the invite request using the mutation, passing the groupId and email
      await sendInvite({ groupId, email });
      toast("Invite sent successfully");
      handleClose();  // Close the modal after sending the invite
    } catch (error) {
      console.error("Error sending invite:", error);
      toast("Failed to send invite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="invite-link-modal-title"
      aria-describedby="invite-link-modal-description"
    >
      <Box sx={styles.modalBox}>
        <Typography variant="h6" id="invite-link-modal-title">
          Send Invite to Group
        </Typography>

        <TextField
          label="Enter Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={styles.textField}
          placeholder="Enter the email"
        />

        <Box sx={styles.buttonsContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendInvite}
            disabled={isLoading}
            sx={styles.button}
          >
            {isLoading ? <CircularProgress size={24} /> : "Send Invite"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={styles.button}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const styles = {
  modalBox: {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    padding: 3,
    borderRadius: 2,
    boxShadow: 24,
  },
  textField: {
    marginBottom: 2,
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
  },
  button: {
    flex: 1,
  },
};

export default InviteLinkModal;
