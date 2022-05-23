import { stripHtml } from 'string-strip-html';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import { SignUpSchema, SignInSchema } from './../models/auth.model.js';
import { MIDDLEWARE, ERROR } from './../blueprint/chalk.js';
import db from './../database/mongoClient.js';

export async function validateSignUp(req, res, next) {
  const { password } = req.body;
  const name = stripHtml(req.body.name || '').result.trim();
  const email = stripHtml(req.body.email || '').result.trim();

  const validate = SignUpSchema.validate(
    {
      name,
      email,
      password,
    },
    { abortEarly: false },
  );
  if (validate.error) {
    console.log(chalk.red(`${ERROR} Invalid input`));
    return res.status(422).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
  }
  res.locals.name = name;
  res.locals.email = email;
  res.locals.password = password;

  console.log(chalk.magenta(`${MIDDLEWARE} Sign-up Schema validated`));
  next();
}

export async function validateEmail(_req, res, next) {
  const { email } = res.locals;
  const user = await db.collection('accounts').findOne({ email });

  if (user) {
    console.log(chalk.red(`${ERROR} Email already registered`));
    return res.status(409).send({
      message: 'Email already registered',
      detail: 'Ensure that the email is unique',
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Email validated`));
  next();
}

export async function validateSignIn(req, res, next) {
  const password = req.body.password;
  const email = stripHtml(req.body.email || '').result.trim();

  const validate = SignInSchema.validate(
    { email, password },
    { abortEarly: false },
  );

  if (validate.error) {
    console.log(chalk.bold.red(`${ERROR} Invalid input`));
    res.status(400).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
    return;
  }
  res.locals.email = email;
  res.locals.password = password;

  console.log(chalk.magenta(`${MIDDLEWARE} Sign-in Schema validated`));
  next();
}

export async function findUser(_req, res, next) {
  const { email } = res.locals;
  let user = null;

  try {
    user = await db.collection('accounts').findOne({ email });

    if (!user) {
      console.log(chalk.bold.red(`${ERROR} User not found`));
      res.status(404).send({
        message: 'User is not registered',
        detail:
          'If user is already registered, ensure that the email is correct',
      });
      return;
    }
  } catch (err) {
    console.log(chalk.bold.red(`${ERROR} ${err}`));
    return res.status(500).send({
      message: 'Internal server error',
      detail: `${err}`,
    });
  }
  res.locals.user = user;

  console.log(chalk.magenta(`${MIDDLEWARE} User found`));
  next();
}

export async function validatePassword(_req, res, next) {
  const { user, password } = res.locals;

  if (!bcrypt.compareSync(password, user.password)) {
    console.log(chalk.bold.red(`${ERROR} Wrong password`));
    return res.status(401).send({
      message: 'Incorrect password',
      detail: 'Ensure that the password is correct',
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Password validated`));
  next();
}

export async function createToken(req, res, next) {
  const sessionId = new ObjectId();
  const data = { session_id: sessionId };

  const secretKey = process.env.JWT_SECRET;
  const config = { expiresIn: process.env.JWT_EXPIRES_IN };
  const token = jwt.sign(data, secretKey, config);

  res.locals.sessionId = sessionId;
  res.locals.token = token;

  console.log(chalk.magenta(`${MIDDLEWARE} Token created`));
  next();
}
