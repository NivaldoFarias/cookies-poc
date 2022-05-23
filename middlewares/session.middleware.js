import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import db from './../database/mongoClient.js';
import { MIDDLEWARE, ERROR } from './../blueprint/chalk.js';

export async function requireToken(req, res, next) {
  const auth = req.header('Auth-Type');

  if (auth === 'cookie') {
    const cookies = req.cookies || {};
    console.table(cookies);

    if (!('session_id' in cookies)) {
      console.log(chalk.red(`${ERROR} No session_id in cookie`));
      return res.status(401).send({
        message: 'Unauthorized',
        detail: 'No session_id in cookie',
      });
    }

    const sessionId = cookies.session_id;
    try {
      const validCookie = await db
        .collection('sessions')
        .findOne({ _id: new ObjectId(sessionId) });
      if (!validCookie) {
        console.log(chalk.red(`${ERROR} Invalid cookie`));
        return res.status(401).send({
          message: 'Invalid cookie',
          detail: 'Please sign in again',
        });
      }
    } catch (err) {
      console.log(chalk.red(`${ERROR} ${err}`));
      return res.status(401).send({
        message: 'Invalid token',
        detail: 'Ensure that the token is correct',
      });
    }
    console.log(chalk.magenta(`${MIDDLEWARE} Cookie validated`));
    next();
  } else if (auth === 'bearer') {
    const token = req.header('authorization')?.replace('Bearer ', '').trim();
    const secretKey = process.env.JWT_SECRET;

    try {
      const data = jwt.verify(token, secretKey);
      res.locals.data = data;
    } catch (err) {
      console.log(chalk.red(`${ERROR} Invalid token`));
      return res.status(401).send({
        message: 'Invalid token',
        detail: err,
      });
    }

    console.log(chalk.magenta(`${MIDDLEWARE} Token validated`));
    next();
  } else {
    console.log(chalk.red(`${ERROR} Invalid Auth-Type`));
    return res.status(401).send({
      message: 'Invalid Auth-Type',
      detail: 'Please provide a valid Auth-Type',
    });
  }
}
