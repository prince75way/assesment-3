
import User from './user.schema';
import {UserDTO} from './user.dto';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../utils/tokenHelper';
import jwt from 'jsonwebtoken';


/**
 * Signs up a new user.
 *
 * @param {UserDTO} userData - The user data to sign up with.
 * @throws {Error} If a user with the same email already exists.
 * @returns {Promise<{
 *   id: string,
 *   name: string,
 *   email: string,
 *   role: 'student' | 'instructor',
 *   accessToken: string,
 *   refreshToken: string,
 * }>} - The signed up user with JWT tokens.
 */
export const signupService = async (userData: UserDTO) => {
 
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return{
      sucess:false,
      message:"User with this email already Exist",
      status:409,
      data:"User with this email already exists"
     }
  }


  const newUser = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password
  });

  // Save the user
  await newUser.save();

  // Generate JWT tokens for the new user
  const tokens = generateTokens(newUser._id.toString());


  newUser.accessToken = tokens.accessToken;
  newUser.refreshToken = tokens.refreshToken;
  await newUser.save();

  return {
    success:true,
    message:"User Signuped Successfully",
    status:200,
   data: {id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,}
  };
};

  /**
   * Handles user login.
   *
   * @param {UserDTO} loginData - The data for the user to login.
   * @returns {Promise<{accessToken: string, refreshToken: string}>} - The access and refresh tokens for the user.
   * @throws Error - If the user does not exist or the credentials are invalid.
   */
  export const loginService = async (loginData: UserDTO) => {
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
     return{
      sucess:false,
      message:"No Such user exist",
      status:404,
      data:"No such user exist"
     }
    }
  
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      return{
        sucess:false,
        message:"Invalid Credentials",
        status:401,
        data:"Invalid Credentials"
       }
    }
  
    const tokens = generateTokens(user._id.toString());
    user.accessToken = tokens.accessToken;
    user.refreshToken = tokens.refreshToken;
    await user.save();
  
    return {
      
        success:true,
        message:"Success Login ",
        status:200,
        data:
     { name: user.name,
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,}
    };
  };
  


 





/**
 * Refreshes the access token using the provided refresh token.
 *
 * @param {string} refreshToken - The refresh token to verify.
 * @returns {Promise<string>} - The new access token.
 * @throws Error - If the user is not found or the refresh token is invalid.
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  // Verify the refresh token
  try {
    const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    const userId = decoded.userId;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1h' } // Access token expiration time
    );

    // Optionally, you can update the access token in the database if required
    // Example: Saving the new access token (not typical but could be useful for tracking)
    user.accessToken = newAccessToken;
    await user.save();

    return newAccessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

  


export const getUserGroupsService = async (userId: string) => {
  // Find the user and populate the 'groups' field to get detailed information
  const user = await User.findById(userId).populate('groups');
  
  if (!user) {
    throw new Error('User not found');
  }

  return user.groups;
};





  /**
   * Adds a user to a group by updating the user document.
   *
   * @param {string} userId - The ID of the user to add to the group.
   * @param {string} groupId - The ID of the group to add the user to.
   * @returns {Promise<User>} - The updated user document with the added group.
   * @throws {Error} - If the user is not found or is already part of the group.
   */
export const addUserToGroupService = async (userId: string, groupId: string) => {

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Prevent adding the same user to the group again
  if (user.groups.includes(groupId)) {
    throw new Error('User is already part of this group');
  }

  // Add the group to the user's groups array and save the user
  user.groups.push(groupId);
  await user.save();

  return user;  // Return the updated user
};