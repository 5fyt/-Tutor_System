import * as Joi from 'joi';
export function handleEnvFilePath() {
  const isDev = process.env.NEST_ENVIRONMENT === 'dev';
  const envFilePath = ['.env'];
  isDev
    ? envFilePath.unshift('.env.development')
    : envFilePath.unshift('.env.production');
  return envFilePath;
}
export function handleValidationSchema() {
  return Joi.object({
    SERVER_PORT: Joi.number().default(9090),

    DATABASE_USER: Joi.string().default('root'),
    DATABASE_PASSWORD: Joi.string().default('root'),
    DATABASE_PORT: Joi.number().default(3306),
    DATABASE_HOST: Joi.string().default('localhost'),
    DATABASE_NAME: Joi.string().default('nest'),
    DATABASE_TYPE: Joi.string().default('mysql'),
    SECRET_KEY: Joi.string().default('nest'),
    NEST_ENVIRONMENT: Joi.valid('prod', 'dev', 'local').default('local'),
  });
}
