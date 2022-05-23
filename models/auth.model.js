import joi from 'joi';

export const SignInSchema = joi.object({
  email: joi.string().email(),
  password: joi
    .string()
    .pattern(/^([a-z\d]{3,30})$/i)
    .required(),
});

export const SignUpSchema = joi.object({
  name: joi.string().min(1),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^([a-z\d]{3,30})$/i)
    .required(),
});
