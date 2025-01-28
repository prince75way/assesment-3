import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { useGetMessagesQuery, useSendMessageMutation } from "../../services/api";
import io from 'socket.io-client';

const socket = await io('http://localhost:5173');

interface ChatSectionProps {
  selectedGroup: {
    _id: string;
    name: string;
  } | null;
}

interface Message {
  message: string;
  timestamp: string;
  groupId: string;
  sender?: {
    _id: string;
    name: string;
    email: string;
  };
}

const ChatSection: React.FC<ChatSectionProps> = ({ selectedGroup }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const { data: fetchedMessages, isLoading, isError, refetch } = useGetMessagesQuery(
    selectedGroup ? selectedGroup._id : "", { skip: !selectedGroup }
  );

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (selectedGroup) {
      socket.emit('joinGroup', selectedGroup._id);
    }

    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedGroup]);

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages.data.map((msg: any) => ({
        message: msg.message,
        timestamp: msg.timestamp,
        groupId: msg.groupId,
        sender: msg.sender,
      })));
    }
  }, [fetchedMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedGroup) {
      const messageToSend: Message = {
        message: newMessage,
        timestamp: new Date().toISOString(),
        groupId: selectedGroup._id,
      };

      try {
        const response = await sendMessage({ ...messageToSend }).unwrap();
        setNewMessage('');
        refetch();
        socket.emit('sendMessage', response);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  if (isLoading) {
    return <Typography variant="h6">Loading chats...</Typography>;
  }

  if (isError) {
    return <Typography variant="h6">Failed to load chats</Typography>;
  }

  return (
    <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" gutterBottom>
        {selectedGroup?.name} - Chats
      </Typography>
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2, display: "flex", flexDirection: "column-reverse" }}>
        <List>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: message.sender?.email === currentUser?.email ? "flex-end" : "flex-start",
                }}
              >
                <ListItemText
                  primary={message.sender?.name || " "}
                  secondary={`${message.message} - ${new Date(message.timestamp).toLocaleTimeString()}`}
                  sx={{
                    backgroundColor: message.sender?.email === currentUser?.email ? "#1976d2" : "#f0f0f0",
                    color: message.sender?.email === currentUser?.email ? "#fff" : "#000",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                    boxShadow: 1,
                  }}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
              No messages yet.
            </Typography>
          )}
        </List>
      </Box>

      <Box sx={{
        display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center",
        paddingTop: 1, position: "sticky", bottom: 0, backgroundColor: "#fff", zIndex: 1, boxShadow: 2,
      }}>
        <TextField
          fullWidth variant="outlined" placeholder="Type your message..."
          value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage} sx={{ marginLeft: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatSection;
