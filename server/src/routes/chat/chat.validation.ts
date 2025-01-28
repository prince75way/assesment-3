
import { body } from 'express-validator';
export const validateSendMessage = [
    body('groupId').notEmpty().withMessage('Group ID is required'),
    body('message').notEmpty().withMessage('Message content is required')]