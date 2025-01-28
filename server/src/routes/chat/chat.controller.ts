import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as chatService from './chat.service';
import { sendResponse } from '../../utils/response.helper';
import jwt from 'jsonwebtoken';
/**
 * Extracts the user ID from the provided access token.
 *
 * @param {string} token - The access token to extract the user ID from.
 * @returns {string | null} - The user ID if the token is valid, null otherwise.
 */
/**
 * Extracts the user ID from the provided access token.
 *
 * @param {string} token - The access token to extract the user ID from.
 * @returns {string | null} - The user ID if the token is valid, null otherwise.
 */
/**
 * @function
 * @param {string} token - The access token to extract the user ID from.
 * @returns {string | null} - The user ID if the token is valid, null otherwise.
 */
const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userId: string };
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

/**
 * Controller to send a new message
 *
 * @function
 * @param {Request} req - The request object containing the message to send.
 * @param {Response} res - The response object to send back the response.
 * @returns {Promise<void>} - Resolves when the message has been sent successfully.
 */
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
     const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>"
    
      if (!token) {
        return sendResponse(res, 401, false, 'Access token is required');
      }
    
      const senderId = getUserIdFromToken(token);
      if (!senderId) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }
  const { groupId, message } = req.body;


  if (!senderId) {
    return sendResponse(res, 400, false, 'Sender ID is required');
  }

  // Call the service to create a new message
  const newMessage = await chatService.sendMessage(groupId, senderId, message);

  return sendResponse(res, 201, true, 'Message sent successfully', newMessage);
});

/**
 * Controller to get all messages in a group
 *
 * @function
 * @param {Request} req - The request object containing the group ID.
 * @param {Response} res - The response object to send back the response.
 * @returns {Promise<void>} - Resolves when the messages have been fetched successfully.
 */
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const groupId = req.params.groupId;


  const messages = await chatService.getMessages(groupId);

  return sendResponse(res, 200, true, 'Messages fetched successfully', messages);
});
