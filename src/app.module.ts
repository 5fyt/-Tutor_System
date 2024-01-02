import { Module } from '@nestjs/common';

import { handleEnvFilePath, handleValidationSchema } from './utils/env';
import { ConfigModule } from '@nestjs/config';
import loadEnv from '../config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: handleEnvFilePath(),
      isGlobal: true,
      ignoreEnvFile: false,
      load: [loadEnv],
      validationSchema: handleValidationSchema(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
