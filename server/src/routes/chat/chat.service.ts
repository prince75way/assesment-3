import ChatMessage from './chat.schema';  // ChatMessage model
import Group from '../group/group.schema';  // Group model

// Service to send a message
/**
 * Service to send a message
 * @param {string} groupId - The ID of the group to send the message to.
 * @param {string} senderId - The ID of the user sending the message.
 * @param {string} message - The content of the message to send.
 * @returns {Promise<ChatMessage>} - The newly created message.
 * @throws {Error} - If the group is not found.
 */
export const sendMessage = async (groupId: string, senderId: string, message: string): Promise<ChatMessage> => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  // Create a new chat message and save it to the database
  const chatMessage = new ChatMessage({
    groupId,
    sender: senderId,
    message,
    timestamp: new Date(),
  });

  await chatMessage.save();
  return chatMessage;
};

// Service to get messages for a specific group
/**
 * Service to get messages for a specific group
 * @param {string} groupId - The ID of the group to retrieve messages for.
 * @returns {Promise<ChatMessage[]>} - An array of messages for the specified group.
 */
export const getMessages = async (groupId: string): Promise<ChatMessage[]> => {
  const messages = await ChatMessage.find({ groupId })
    .populate('sender', 'name email')  // Populate sender info if needed
    .sort({ timestamp: 1 });  // Sort messages by timestamp in ascending order
  return messages;
};
