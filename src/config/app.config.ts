import * as Joi from 'joi';

/**
 * This validation object runs at build time, so if
 * something isn't right, the application won't build.
 */
export const validationSchema = Joi.object({
  MONGODB_URI: Joi.required(), //
  PORT: Joi.number().port().default(3001),
  DEFAULT_LIMIT: Joi.number().default(10),
});

export const appConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodbUri: process.env.MONGODB_URI, // * We don't assign default values to these because the validationSchema is already doing so.
  port: process.env.PORT,
  defaultLimit: process.env.DEFAULT_LIMIT,
});
