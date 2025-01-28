import express from "express";
import userRoutes from './routes/user/user.routes'
import groupRoutes from './routes/group/group.routes'
import chatRoutes from './routes/chat/chat.routes'
// routes
const router = express.Router();

router.use("/user", userRoutes);
router.use('/group',groupRoutes);
router.use('/chat',chatRoutes);

export default router;