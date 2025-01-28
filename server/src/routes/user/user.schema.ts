
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserDTO } from './user.dto';



const userSchema: Schema<UserDTO> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Group', 
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook for hashing passwords
userSchema.pre<UserDTO>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err:any) {
    next(err);
  }
});


/**
 * Compares the provided candidate password with the stored hashed password.
 * 
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, otherwise false.
 */

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model<UserDTO>('User', userSchema);
export default User;
