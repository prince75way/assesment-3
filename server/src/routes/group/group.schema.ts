import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Group
export interface Group extends Document {
  name: string; // Group's name
  description?: string; // Optional description of the group
  members: mongoose.Schema.Types.ObjectId[]; // List of User IDs that are members
  createdBy: mongoose.Schema.Types.ObjectId; // The user who created the group
  inviteLink:string;
}

// Define the schema for the Group
const groupSchema: Schema<Group> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    inviteLink:{
      type:String,
      required:true
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the creator (User model)
      required: true,
    },
  },
  { timestamps: true }
);

// Export the Group model
const Group = mongoose.model<Group>('Group', groupSchema);
export default Group;
