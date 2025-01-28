import { body, param } from 'express-validator';

  export const createGroup=[
    body('name').notEmpty().withMessage('Group name is required'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('members')
      .optional()
      .isArray()
      .withMessage('Members should be an array of user IDs'),
  ]

  // Validation for adding/removing members
  export const modifyMember= [
    param('id').isMongoId().withMessage('Invalid group ID'),
    body('userIds')
      .isArray()
      .withMessage('User IDs must be an array')
      .notEmpty()
      .withMessage('At least one user ID is required'),
  ]

  // Validation for deleting a group
 export const  deleteGroup= [
    param('id').isMongoId().withMessage('Invalid group ID'),
  ]

  // Validation for fetching a group by ID
export const  getGroupById =[
    param('id').isMongoId().withMessage('Invalid group ID'),
  ]



export const validateInviteLink = [
    body('groupId').notEmpty().withMessage('Group ID is required'),
    body('email').isEmail().withMessage('Valid email is required'),
]  


export const joinGroupValidation = [  
  body('groupId').notEmpty().withMessage('Group ID is required'),]