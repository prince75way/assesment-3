import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'; // Import asyncHandler
import {
  signupService,
  loginService,
  refreshAccessToken,
  getUserGroupsService
} from './user.service';
import { sendResponse } from '../../utils/response.helper';
import jwt from 'jsonwebtoken'

/**
 * Handles sign up of a new user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>} - resolves with a successful response
 */
export const signupController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await signupService(req.body);
  res.status(result.status).json({"success":result.success,"message":result.message,"data":result.data})
});




/**
 * Handles login of an existing user
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>} - resolves with a successful response
 */
export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await loginService(req.body);
  // sendResponse(res, 200, true, 'User logged in successfully', tokens);
  res.status(result.status).json({"success":result.success,"message":result.message,"data":result.data})
});






/**
 * Refreshes the access token using the provided refresh token.
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object to send back the new access token.
 * @returns {Promise<void>} - Resolves when the access token is refreshed successfully.
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    sendResponse(res, 401, false, 'Refresh token is required');
    return;
  }

  const newAccessToken = await refreshAccessToken(refreshToken);
  sendResponse(res, 200, true, 'Access token refreshed successfully', { accessToken: newAccessToken });
});

/**
 * Helper function to extract userId from the token
 * @param {string} token - The access token to extract userId from
 * @returns {string | null} - The userId if the token is valid, null otherwise
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
 * Get user groups
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>} - resolves with a successful response
 */
export const getUserGroups = asyncHandler(async (req, res) => {

 const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>"

  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }
  // Call service function to get user groups
  const groups = await getUserGroupsService(userId);

  res.json({ groups });
});

