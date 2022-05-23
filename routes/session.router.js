import express from 'express';
import dotenv from 'dotenv';

import { requireToken } from './../middlewares/session.middleware.js';
import * as session from './../controllers/session.controller.js';

dotenv.config();

const sessionRouter = express.Router();
sessionRouter.get('/api/accounts', requireToken, session.getUsers);

export default sessionRouter;
