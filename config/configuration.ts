export const env = (targetName: string) => {
  return process.env[targetName];
};

export default () => {
  return {
    server: {
      port: parseInt(env('SERVER_PORT'), 10) || 3000,
      host: env('SERVER_HOST'),
    },
    database: {
      host: env('DATABASE_HOST'),
      port: parseInt(env('DATABASE_PORT'), 10) || 5210,
      user: env('DATABASE_USER'),
      name: env('DATABASE_NAME'),
      type: env('DATABASE_TYPE'),
      password: env('DATABASE_PASSWORD'),
      logging: ['error'],
    },
    logger: {
      on: env('LOG_ON'),
      timestamp: false,
      dir: env('LOGGER_DIR'),
      maxFileSize: env('OGGER_MAX_SIZE'),
      maxFiles: env('LOGGER_MAX_FILES'),
      errorLogName: env('LOGGER_ERROR_FILENAME'),
      appLogName: env('LOGGER_APP_FILENAME0'),
    },
    authSecret: {
      secret: env('SECRET_KEY'),
      encryptedPwdKey: env('ENCRYPTED_PWD_KEY'),
    },
  };
};
