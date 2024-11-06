// there's a path processing and some actions

import { Router } from 'express'
import AuthController from './controller.js';

const AuthRouter = Router();

// CRUD
AuthRouter.get('/api/auth/confirm', AuthController.confirm)
AuthRouter.post('/api/auth/signin', AuthController.signIn)
AuthRouter.post('/api/auth/signup', AuthController.signUp)

export default AuthRouter;