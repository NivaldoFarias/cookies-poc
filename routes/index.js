import express from 'express';

import sessionRouter from './session.router.js';
import authRouter from './auth.router.js';

const router = express.Router();

router.use(sessionRouter);
router.use(authRouter);

export default router;
