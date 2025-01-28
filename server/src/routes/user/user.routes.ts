import { validateRequest } from './../../common/middlewares/validation.middleware';
import express, { RequestHandler } from 'express';
import * as validation from './user.validation';
import * as controller from './user.controller';





const router = express.Router();


router.post('/signup', validation.userSignupValidation, validateRequest, controller.signupController);


router.post('/login', validation.userLoginValidation, validateRequest, controller.loginController);

router.get('/groups', controller.getUserGroups);

// To refresh the tokens with the refresh-token
router.post('/refresh-token', controller.refreshToken as unknown as RequestHandler);





export default router;
