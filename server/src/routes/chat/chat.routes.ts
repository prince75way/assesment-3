import express from 'express';
import { sendMessage, getMessages } from './chat.controller';
import { validateSendMessage } from './chat.validation';  // Validation for message sending
import { validateRequest } from '../../common/middlewares/validation.middleware';
const router = express.Router();

// Route to send a new message
router.post('/', validateSendMessage,validateRequest, sendMessage);

// Route to get all messages for a specific group
router.get('/:groupId', validateRequest,getMessages);

export default router;
