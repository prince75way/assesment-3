import { motion } from "framer-motion";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Info, Users, MessageCircle } from "lucide-react"; // Updated icon for chat-related content
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        textAlign: "center",
        px: 3,
      }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome to Chatsphere
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "700px", mx: "auto" }}>
          Welcome to **Chatsphere**, a dynamic and interactive platform designed to
          bring people together through engaging group chats, discussions, and
          collaborations. Our mission is to provide a seamless chatting experience
          for individuals, teams, and communities alike.
        </Typography>
      </motion.div>

      {/* Feature Cards with Motion */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 4,
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {[
          {
            icon: (
              <Users style={{ color: "#6366F1", width: 56, height: 56, marginBottom: 16 }} />
            ),
            title: "For Community Leaders",
            description:
              "Create and manage group chats effortlessly. Empower your community with real-time conversations, direct messaging, and more.",
            hoverColor: "#EEF2FF",
          },
          {
            icon: (
              <MessageCircle style={{ color: "#A855F7", width: 56, height: 56, marginBottom: 16 }} />
            ),
            title: "For Chat Enthusiasts",
            description:
              "Join dynamic group chats, share ideas, and stay connected with your community. Real-time messaging makes communication faster and easier.",
            hoverColor: "#F3E8FF",
          },
          {
            icon: (
              <Info style={{ color: "#EC4899", width: 56, height: 56, marginBottom: 16 }} />
            ),
            title: "Our Vision",
            description:
              "To connect people through meaningful conversations, foster strong communities, and enable efficient team collaboration through innovative features.",
            hoverColor: "#FEE2E2",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2 * index,
              ease: "easeOut",
            }}
          >
            <Card
              sx={{
                backgroundColor: "white",
                color: "text.primary",
                "&:hover": { backgroundColor: item.hoverColor },
                transition: "background-color 0.3s ease",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {item.icon}
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Call-to-Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ marginTop: "3rem" }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "#6366F1",
            fontWeight: "bold",
            fontSize: "1rem",
            px: 4,
            py: 1.5,
            "&:hover": { backgroundColor: "#F3F4F6" },
          }}
          onClick={() => {
            navigate("/"); // Adjusted route to 'explore'
          }}
        >
          Start Chatting
        </Button>
      </motion.div>
    </Box>
  );
};

export default AboutPage;
