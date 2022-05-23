import dotenv from 'dotenv';
import chalk from 'chalk';

import { SERVER, ERROR } from './../blueprint/chalk.js';
import db from './../database/mongoClient.js';

dotenv.config();

export async function getUsers(_req, res) {
  try {
    const accounts = await db.collection('accounts').find().toArray();

    console.log(chalk.bold.yellow(`${SERVER} Sent to client all accounts`));
    res.status(200).send(accounts);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    res.status(500).send({
      message: 'Internal error while getting users',
      detail: err,
    });
  }
}
