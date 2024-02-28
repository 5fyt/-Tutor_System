import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationError } from 'class-validator';
import { LoggerService } from './shared/logger/logger.service';
import { ApiExceptionFilter } from './filters/api-exception.filter';
import { ApiTransformInterceptor } from './intercepts/transform.interceptor';
import { Core } from './lib/Core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // app.enableCors();
  new Core(app);
  app.useLogger(app.get(LoggerService));
  //注册全局错误过滤器
  app.useGlobalFilters(new ApiExceptionFilter(app.get(LoggerService)));
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/api',
  });
  // validate
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(
          errors
            .filter((item) => !!item.constraints)
            .flatMap((item) => Object.values(item.constraints))
            .join('; '),
        );
      },
    }),
  );
  //注册全局拦截器
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));
  const port = configService.get<number>('server.port');
  app.setGlobalPrefix('/api');
  await app.listen(port);
}
bootstrap();
