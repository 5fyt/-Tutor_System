import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  //   constructor(private logger: LoggerService) {}
  //   private message;
  catch(exception: unknown, next: ArgumentsHost) {
    const host = next.switchToHttp();
    const response = host.getResponse<Response>();
    // const request = host.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // this.logger.debug(
    //   `error==>${request.method} ${request.url} reason==>${
    //     exception instanceof HttpException ? exception.message : exception
    //   }`,
    // );
    let message = '服务器异常，请稍后再试';
    // 开发模式下提示500类型错误，生产模式下屏蔽500内部错误提示
    // if (isDev() || status < 500) {
    message =
      exception instanceof HttpException ? exception.message : `${exception}`;
    // if (status >= 500) {
    //   this.logger.error(exception, ApiExceptionFilter.name);
    // }
    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
