import { Router } from 'express';

import * as auth from './../controllers/auth.controller.js';
import {
  validateSignUp,
  validateSignIn,
  validateEmail,
  validatePassword,
  findUser,
  createToken,
} from './../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post(
  '/api/auth/sign-up',
  validateSignUp,
  validateEmail,
  auth.signUp,
);
authRouter.post(
  '/api/auth/sign-in',
  validateSignIn,
  findUser,
  validatePassword,
  createToken,
  auth.signIn,
);

export default authRouter;
