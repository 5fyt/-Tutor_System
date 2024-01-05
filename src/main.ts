import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { LoggerService } from '@nestjs/common';
import { ApiExceptionFilter } from './filters/api-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  //注册全局错误过滤器
  app.useGlobalFilters(new ApiExceptionFilter());
  const port = configService.get<number>('server.port');
  await app.listen(port);
}
bootstrap();
