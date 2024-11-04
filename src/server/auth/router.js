// there's a path processing and some actions

import { Router } from 'express'
import AuthController from './controller.js';

const AuthRouter = Router();

// CRUD
AuthRouter.get('/auth/confirm', AuthController.confirm)
AuthRouter.post('/auth/signin', AuthController.signIn)
AuthRouter.post('/auth/signup', AuthController.signUp)

export default AuthRouter;