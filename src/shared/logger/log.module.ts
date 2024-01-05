import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'winston-daily-rotate-file';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransports = new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Log ', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        });
        const dailyWarnTransports = new winston.transports.DailyRotateFile({
          // 日志文件文件夹，建议使用path.join()方式来处理，或者process.cwd()来设置，此处仅作示范
          dirname: 'src/logs',
          // 日志文件名 %DATE% 会自动设置为当前日期
          filename: 'application-%DATE%.info.log',
          // 日期格式
          datePattern: 'YYYY-MM-DD',
          // 压缩文档，用于定义是否对存档的日志文件进行 gzip 压缩 默认值 false
          zippedArchive: true,
          // 文件最大大小，可以是bytes、kb、mb、gb
          maxSize: '20m',
          // 最大文件数，可以是文件数也可以是天数，天数加单位"d"，
          maxFiles: '7d',
          // 格式定义，同winston
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.simple(),
          ),
          // 日志等级，不设置所有日志将在同一个文件
          level: 'warn',
        });
        const dailyErrorTransports = new winston.transports.DailyRotateFile({
          // 日志文件文件夹，建议使用path.join()方式来处理，或者process.cwd()来设置，此处仅作示范
          dirname: 'src/logs',
          // 日志文件名 %DATE% 会自动设置为当前日期
          filename: 'application-%DATE%.info.log',
          // 日期格式
          datePattern: 'YYYY-MM-DD',
          // 压缩文档，用于定义是否对存档的日志文件进行 gzip 压缩 默认值 false
          zippedArchive: true,
          // 文件最大大小，可以是bytes、kb、mb、gb
          maxSize: '20m',
          // 最大文件数，可以是文件数也可以是天数，天数加单位"d"，
          maxFiles: '7d',
          // 格式定义，同winston
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.json(),
          ),
          // 日志等级，不设置所有日志将在同一个文件
          level: 'error',
        });
        return {
          transports: [
            consoleTransports,
            ...(configService.get<string>('logger.on')
              ? [dailyErrorTransports, dailyWarnTransports]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LogModule {}
