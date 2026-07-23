import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  INTERNAL_JWT_SECRET: Joi.string().min(8).required(),
  AUTH_SERVICE_URL: Joi.string().uri().required(),
});
