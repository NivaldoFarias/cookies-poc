import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';

import { SERVER } from './blueprint/chalk.js';
import router from './routes/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(json());
app.use(router);

app.get('/', (_req, res) => {
  res.send('Online');
});

app.listen(PORT, () => {
  console.log(chalk.bold.yellow(`${SERVER} Server started on port ${PORT}`));
});
