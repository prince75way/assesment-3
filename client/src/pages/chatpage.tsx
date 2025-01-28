import { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { motion } from "framer-motion";
import GroupDetails from "../components/GroupDetails";
import GroupsList from "../components/GroupList";
import ChatSection from "../components/ChatSection";
interface Group {

  _id: string;
  name: string;
  inviteLink: string;
  members: { name: string; email: string }[];
}
import { useGetGroupsQuery } from "../services/api";

const ChatPage = () => {
  

  const { data: groups = [], isLoading, isError } = useGetGroupsQuery(); // RTK Query Hook
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    console.log("groups",groups)
  useEffect(() => {
    if (groups.length > 0) {
      setSelectedGroup(groups[0]); // Default to the first group
    }
  }, [groups]);

  if (isLoading) {
    return <div>Loading groups...</div>; // Show a loading indicator while fetching
  }

  if (isError) {
    return <div>Failed to load groups. Please try again later.</div>; // Show an error message if the API call fails
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Groups List Section */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "25%", height: "100%" }}
      >
        <Paper elevation={3} sx={{ height: "100%" }}>
          <GroupsList
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={(group: Group) => setSelectedGroup(group)}
          />
        </Paper>
      </motion.div>

      {/* Chat Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ width: "50%", height: "100%" }}
      >
        <Paper elevation={3} sx={{ height: "100%" }}>
          <ChatSection selectedGroup={selectedGroup} />
        </Paper>
      </motion.div>

      {/* Group Details Section */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "25%", height: "100%" }}
      >
        <Paper elevation={3} sx={{ height: "100%" }}>
          <GroupDetails selectedGroup={selectedGroup} />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ChatPage;
