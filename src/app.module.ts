import { Module } from '@nestjs/common';
import { handleEnvFilePath, handleValidationSchema } from './utils/env';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loadEnv from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { LogModule } from './shared/logger/log.module';
console.log(process.env.NEST_ENVIRONMENT);
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          host: config.get<string>('database.host'),
          type: 'mysql',
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          port: config.get<number>('database.port'),
          database: config.get<string>('database.name'),
          logging: process.env.NEST_ENVIRONMENT === 'dev',
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    LogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
