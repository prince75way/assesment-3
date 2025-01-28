import mongoose, { Schema, Document } from 'mongoose';

interface ChatMessage extends Document {
  groupId: mongoose.Types.ObjectId;  // Reference to the group the message belongs to
  sender: mongoose.Types.ObjectId;  // Reference to the user who sent the message
  message: string;  // The message content
  timestamp: Date;  // Timestamp of the message
}

const chatMessageSchema = new Schema<ChatMessage>({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model<ChatMessage>('ChatMessage', chatMessageSchema);

export default ChatMessage;
