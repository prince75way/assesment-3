import express from 'express';
import { createGroup,joinGroup, getAllGroups, getGroupById,generateInviteLink, addMembers, removeMembers, deleteGroup } from './group.controller';
import * as validation from './group.validation';
import { validateRequest } from '../../common/middlewares/validation.middleware';
const router = express.Router();

router.post('/', validation.createGroup,validateRequest, createGroup);

//get all groups related to a person anyhow whether user or member
router.get('/', getAllGroups);

router.get('/:id',validation.getGroupById,validateRequest, getGroupById);
router.post('/groups/:id/members', validation.modifyMember,validateRequest, addMembers);
router.delete('/groups/:id/members', removeMembers);
router.delete('/groups/:id',validation.deleteGroup,validateRequest, deleteGroup);

router.post('/invite', validation.validateInviteLink,validateRequest, generateInviteLink);

router.post("/join",validation.joinGroupValidation, validateRequest,joinGroup);

export default router;
