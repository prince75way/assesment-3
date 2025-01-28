import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import * as groupService from './group.service';
import { sendResponse } from '../../utils/response.helper'; 
import { sendInviteEmail } from '../../common/helper/email.helper';
import Group from './group.schema';



/**
 * Extracts the user ID from the provided access token.
 *
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
 * Generates an invite link for a group and sends it via email.
 *
 * @param {Request} req - The request object containing groupId and email.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - Resolves when the invite link is generated and sent successfully.
 */
export const generateInviteLink = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, email } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }

  const isAdmin = await Group.findOne({ createdBy: userId });

  if (!isAdmin) {
    return sendResponse(res, 403, false, 'Access denied. Only admins can generate invite links.');
  }

  const inviteLink = await groupService.createInviteLink(groupId);
  await sendInviteEmail(email, inviteLink);

  return sendResponse(res, 200, true, 'Invite link sent successfully');
});



/**
 * Joins a group using an invite link.
 *
 * @param {Request} req - The request object containing the invite link.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - Resolves when the user successfully joins the group.
 */

export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }

  const group = await groupService.createGroup(req.body, userId);
  return sendResponse(res, 201, true, 'Group created successfully', group);
});


/**
 * Gets all groups a user is associated with (as a member or owner).
 *
 * @param {Request} req - The request object containing the access token.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - Resolves when the groups are fetched successfully.
 */
export const getAllGroups = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
  
    if (!token) {
      return sendResponse(res, 401, false, 'Access token is required');
    }
  
    const userId = getUserIdFromToken(token); // Decode user ID from token
    if (!userId) {
      return sendResponse(res, 401, false, 'Unauthorized');
    }
  
    // Get groups where the user is either a member or the creator
    const groups = await groupService.getGroupsForUser(userId);
  
    if (groups.length === 0) {
      return sendResponse(res, 404, false, 'No groups found for this user');
    }
  
    return sendResponse(res, 200, true, 'Groups fetched successfully', groups);
  });
/**
 * Gets a group by ID.
 * 
 * @param {Request} req - The request object containing the group ID and access token.
 * @param {Response} res - The response object to send the response.
 * 
 * @returns {Promise<void>} - Resolves when the group is fetched successfully.
 */
export const getGroupById = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }

  const group = await groupService.getGroupById(req.params.id, userId);

  return sendResponse(res, 200, true, 'Group details fetched successfully', group);
});



/**
 * Adds one or more members to a group.
 * 
 * @param {Request} req - The request object containing the group ID and list of user IDs to add.
 * @param {Response} res - The response object used to send the response.
 * 
 * @returns {Promise<void>} - Resolves when the group is updated successfully.
 */
export const addMembers = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }

  const updatedGroup = await groupService.addMembers(req.params.id, req.body.userIds);
  return sendResponse(res, 200, true, 'Members added successfully', updatedGroup);
});


/**
 * Removes one or more members from a group.
 * 
 * @param {Request} req - The request object containing the group ID and list of user IDs to remove.
 * @param {Response} res - The response object used to send the response.
 * 
 * @returns {Promise<void>} - Resolves when the group is updated successfully.
 */
export const removeMembers = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }

  const updatedGroup = await groupService.removeMembers(req.params.id, req.body.userIds);
  return sendResponse(res, 200, true, 'Members removed successfully', updatedGroup);
});

/**
 * Deletes a group.
 *
 * @async
 * @function deleteGroup
 * @param {Request} req - The request object containing the group ID.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - Sends a success or error response.
 */
export const deleteGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }

  await groupService.deleteGroup(req.params.id, userId);
  return sendResponse(res, 200, true, 'Group deleted successfully');
});


/**
 * Joins a group using an invite link.
 * 
 * @param {Request} req - The request object containing the group ID and invite link.
 * @param {Response} res - The response object to send the response.
 * 
 * @returns {Promise<void>} - Resolves when the group is joined successfully.
 */
export const joinGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { groupId, inviteLink } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>"

  if (!token) {
    return sendResponse(res, 401, false, 'Access token is required');
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return sendResponse(res, 401, false, 'Unauthorized');
  }

  // Call the service to join the group
  await groupService.joinGroupService(userId, groupId, inviteLink);
  // If successful, return a success response
  res.status(200).json({
    message: "Successfully joined the group!",
  });
});

