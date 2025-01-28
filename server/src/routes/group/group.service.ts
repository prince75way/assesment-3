import Group from "./group.schema";
import mongoose from 'mongoose';
import User from '../user/user.schema';
import { v4 as uuidv4 } from 'uuid'; // Import uuid package
import { addUserToGroupService } from "../user/user.service";


  /**
   * Creates a new group with the given data and adds the creator and all members to the group.
   * @param {Object} groupData - The data for the new group: { name, description, members }
   * @param {string} userId - The userId of the group creator
   * @returns {Promise<Group>} - The newly created group
   */
export const createGroup = async (groupData: any, userId: string) => {
  const { name, description, members = [] } = groupData;

  // Generate a unique identifier for the invite link (e.g., UUID or specific URL)
  const inviteLink = `http://yourdomain.com/group/join`; // Replace with your actual base URL

  // Fetch user IDs for each email in the members array
  const userDocs = await User.find({ email: { $in: members } });
  const memberIds = userDocs.map((user) => user._id);

  // Add the creator's userId to the members array
  memberIds.push(userId);

  // Create a new group with the invite link
  const newGroup = new Group({
    name,
    description,
    members: memberIds,
    createdBy: userId,
    inviteLink, // Store the invite link in the group
  });

  // Save the new group to the database
  await newGroup.save();

  // Update each member (including the creator) to store the new groupId in their "groups" field
  await User.updateMany(
    { _id: { $in: memberIds } },
    { $push: { groups: newGroup._id } } // Add the new groupId to each user's groups array
  );

  return newGroup;
};

  /**
   * Creates an invite link for a group.
   * @param groupId - The ID of the group to create an invite link for.
   * @returns A string representing the invite link.
   * @throws {Error} If the group is not found.
   */
export const createInviteLink = async (groupId: string): Promise<string> => {
  
    const group = await Group.findById(groupId)
    if (!group) {
      throw new Error('Group not found');
    }
  

    const inviteLink = `${process.env.BASE_URL}/join-group/${groupId}`;
    group.inviteLink = inviteLink;
    await group.save();
  
    // You can store this inviteToken in the database if needed (optional)
    // Example: group.invites.push({ inviteToken, expiresAt: new Date(Date.now() + 3600000) });
  
    return inviteLink;
  }



  /**
   * Fetches all groups where the user is either a member or the creator (admin).
   * @param {string} userId - The ID of the user to retrieve groups for.
   * @returns {Promise<import("./group.schema").IGroup[]>} - An array of groups the user is a part of.
   */
export const getGroupsForUser = async (userId: string) => {
    // Find all groups where the user is either a member or the creator (admin)
    const groups = await Group.find({
      $or: [
        { members: userId },  // User is a member of the group
        { createdBy: userId }  // User is the creator of the group
      ]
    });
  
    return groups;
  };

  /**
   * Fetches a group by its ID if the user is either a member or the creator of the group.
   * @param {string} groupId - The ID of the group to retrieve.
   * @param {string} userId - The ID of the user to check against.
   * @returns {Promise<import("./group.schema").IGroup & import("mongoose").Document & { members: import("../user/user.schema").IUser[]; createdBy: import("../user/user.schema").IUser; }>} - The retrieved group with populated members and createdBy.
   * @throws {Error} - If the group is not found or the user is not a member or creator of the group.
   */
export const getGroupById = async (groupId: string, userId: string) => {
  const group = await Group.findOne({
    _id: groupId,
    
  })
    .populate('members', 'name email')
    .populate('createdBy', 'name email');

  return group;
};
export const addMembers = async (groupId: string, userIds: string[]) => {
    const group = await Group.findById(groupId);
  
    if (!group) {
      throw new Error('Group not found');
    }
  
    // Check if the logged-in user (userIds[0]) is the group creator
    if (group.createdBy.toString() !== userIds[0]) {
      throw new Error('Only the group creator can add members');
    }
  
    // Correctly cast the ObjectId to mongoose.Schema.Types.ObjectId
    group.members.push(...userIds.map(id => new mongoose.Types.ObjectId(id) as any));

    

    // Save the group after updating members
    await group.save();

    userIds.forEach(async (userId) => {
      await addUserToGroupService(userId, groupId);
    });
  
    return group;
  };

  /**
   * Removes one or more members from a group.
   * @param {string} groupId - The ID of the group to remove members from.
   * @param {string[]} userIds - The IDs of the users to remove from the group.
   * @returns {Promise<import("./group.schema").IGroup>} - The updated group document.
   * @throws {Error} - If the group is not found or the logged-in user is not the group creator.
   */
export const removeMembers = async (groupId: string, userIds: string[]) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');
  if (group.createdBy.toString() !== userIds[0]) throw new Error('Only the group creator can remove members');

  group.members = group.members.filter(
    (memberId: any) => !userIds.includes(memberId.toString())
  );
  await group.save();
  return group;
};

export const deleteGroup = async (groupId: string, userId: string) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');
  if (group.createdBy.toString() !== userId) throw new Error('Only the group creator can delete the group');

  await group.deleteOne();
};



interface JoinGroupServiceResponse {
    message: string;
}

/**
 * Allows a user to join a group using an invite link.
 *
 * @param {string} userId - The ID of the user to add to the group.
 * @param {string} groupId - The ID of the group to add the user to.
 * @param {string} inviteLink - The invite link for the group.
 * @returns {Promise<JoinGroupServiceResponse>} - A promise resolving to an object with a "message" property.
 * @throws {Error} - If the group is not found, the invite link is invalid, the user is not found, or the user is already a member of the group.
 */
export const joinGroupService = async (userId: string, groupId: string,inviteLink:string): Promise<JoinGroupServiceResponse> => {
    const group = await Group.findById(groupId);
    if (!group) {
        throw new Error("Group not found.");
    }

    if(group.inviteLink!==inviteLink){
        throw new Error("Invalid invite link.");
    }

    // Check if the user already exists in the group
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found.");
    }

    // Check if the user is already a member of the group
    if (group.members.includes(userId as unknown as mongoose.Schema.Types.ObjectId)) {
        throw new Error("User is already a member of this group.");
    }

    // Add the user to the group's members
    group.members.push(userId as unknown as mongoose.Schema.Types.ObjectId);
    await group.save();

    await addUserToGroupService(userId, groupId);

    return { message: "User successfully joined the group." };
}