import { Module } from '@nestjs/common';
import { handleEnvFilePath, handleValidationSchema } from './utils/env';
import {
  LoggerModuleOptions,
  WinstonLogLevel,
} from './shared/logger/logger.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loadEnv from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { LoggerModule } from './shared/logger/logger.module';
import { TypeORMLoggerService } from './shared/logger/typeorm-logger.service';
import { LOGGER_MODULE_OPTIONS } from './shared/logger/logger.constants';
import { LoginModule } from './modules/login/login.module';
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
      imports: [ConfigModule, LoggerModule],
      useFactory: (
        config: ConfigService,
        loggerOptions: LoggerModuleOptions,
      ) => {
        return {
          host: config.get<string>('database.host'),
          type: 'mysql',
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          port: config.get<number>('database.port'),
          database: config.get<string>('database.name'),
          logger: new TypeORMLoggerService(
            config.get('database.logging'),
            loggerOptions,
          ),
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService, LOGGER_MODULE_OPTIONS],
    }),
    LoggerModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            level: configService.get<WinstonLogLevel>('logger.level'),
            consoleLevel: configService.get<WinstonLogLevel>(
              'logger.consoleLevel',
            ),
            timestamp: configService.get<boolean>('logger.timestamp'),
            maxFiles: configService.get<string>('logger.maxFiles'),
            maxFileSize: configService.get<string>('logger.maxFileSize'),
            disableConsoleAtProd: configService.get<boolean>(
              'logger.disableConsoleAtProd',
            ),
            dir: configService.get<string>('logger.dir'),
            errorLogName: configService.get<string>('logger.errorLogName'),
            appLogName: configService.get<string>('logger.appLogName'),
          };
        },
        inject: [ConfigService],
      },
      // global module
      true,
    ),
    UserModule,
    LoginModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
