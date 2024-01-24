// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   HttpStatus,
//   LoggerService,
//   Inject,
// } from '@nestjs/common';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// import { Request, Response } from 'express';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { inspect } from 'util';

// interface ReturnData {
//   data: any;
//   code: number;
//   message: string | null;
// }

// @Injectable()
// export class TransformInterceptor implements NestInterceptor {
//   constructor(
//     @Inject(WINSTON_MODULE_NEST_PROVIDER)
//     private readonly logger: LoggerService,
//   ) {}
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<ReturnData> {
//     const host = context.switchToHttp();
//     const req = host.getRequest<Request>();
//     const res = host.getResponse<Response>();
//     const startTime = Date.now();

//     if (res.Code === HttpStatus.CREATED && req.method === 'POST') {
//       return next.handle().pipe(
//         map((data) => {
//           this.logger.log(
//             `${req.method} ${req.url} ${inspect(req.body)} ==> ${
//               res.statusCode
//             } ${Date.now() - startTime}ms`,
//           );
//           return { data, code: 200, message: '创建成功' };
//         }),
//       );
//     } else if (req.method === 'PATCH') {
//       return next.handle().pipe(
//         map((data) => {
//           this.logger.log(
//             `method="${req.method}" url="${req.url}" params=${inspect(
//               req.body,
//             )} spend="${Date.now() - startTime}ms"`,
//           );
//           return { data, code: 200, message: '修改成功' };
//         }),
//       );
//     } else if (req.method === 'DELETE') {
//       return next.handle().pipe(
//         map((data) => {
//           this.logger.log(
//             `${req.method} ${req.url} ==> ${Date.now() - startTime}ms`,
//           );
//           return { data, code: 200, message: '删除成功' };
//         }),
//       );
//     }

//     return next.handle().pipe(
//       map((data) => {
//         this.logger.log(
//           `${req.method} ${req.url} ==> ${res.statusCode} ${
//             Date.now() - startTime
//           }ms`,
//         );
//         return { data, code: 200, message: '获取成功' };
//       }),
//     );
//   }
// }
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { FastifyReply } from 'fastify';
import { map } from 'rxjs/operators';
import { TRANSFORM_KEEP_KEY_METADATA } from '../common/constants/decorator.contants';
import { ResponseDto } from '../common/class/res.class';

/**
 * 统一处理返回接口结果，如果不需要则添加@Keep装饰器
 */
export class ApiTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const keep = this.reflector.get<boolean>(
          TRANSFORM_KEEP_KEY_METADATA,
          context.getHandler(),
        );
        if (keep) {
          return data;
        } else {
          const response = context.switchToHttp().getResponse<FastifyReply>();
          response.header('Content-Type', 'application/json; charset=utf-8');
          return new ResponseDto(200, data);
        }
      }),
    );
  }
}
