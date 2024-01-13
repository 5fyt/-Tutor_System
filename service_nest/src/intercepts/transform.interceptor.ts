import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inspect } from 'util';

interface ReturnData {
  data: any;
  code: number;
  message: string | null;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ReturnData> {
    const host = context.switchToHttp();
    const req = host.getRequest<Request>();
    const res = host.getResponse<Response>();
    const startTime = Date.now();

    if (res.statusCode === HttpStatus.CREATED && req.method === 'POST') {
      return next.handle().pipe(
        map((data) => {
          this.logger.log(
            `${req.method} ${req.url} ${inspect(req.body)} ==> ${
              res.statusCode
            } ${Date.now() - startTime}ms`,
          );
          return { data, code: 200, message: '创建成功' };
        }),
      );
    } else if (req.method === 'PATCH') {
      return next.handle().pipe(
        map((data) => {
          this.logger.log(
            `method="${req.method}" url="${req.url}" params=${inspect(
              req.body,
            )} spend="${Date.now() - startTime}ms"`,
          );
          return { data, code: 200, message: '修改成功' };
        }),
      );
    } else if (req.method === 'DELETE') {
      return next.handle().pipe(
        map((data) => {
          this.logger.log(
            `${req.method} ${req.url} ==> ${Date.now() - startTime}ms`,
          );
          return { data, code: 200, message: '删除成功' };
        }),
      );
    }

    return next.handle().pipe(
      map((data) => {
        this.logger.log(
          `${req.method} ${req.url} ==> ${res.statusCode} ${
            Date.now() - startTime
          }ms`,
        );
        return { data, code: 200, message: '获取成功' };
      }),
    );
  }
}
