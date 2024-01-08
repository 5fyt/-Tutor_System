import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { LoggerService } from './shared/logger/logger.service';
import { ApiExceptionFilter } from './filters/api-exception.filter';
import { TransformInterceptor } from './intercepts/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useLogger(app.get(LoggerService));
  //注册全局错误过滤器
  app.useGlobalFilters(new ApiExceptionFilter(app.get(LoggerService)));

  //注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor(app.get(LoggerService)));
  const port = configService.get<number>('server.port');
  await app.listen(port);
}
bootstrap();
