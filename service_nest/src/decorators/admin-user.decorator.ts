import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ADMIN_USER } from 'src/guards/constants/admin.contants';

export const AdminUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // auth guard will mount this
    const user = request[ADMIN_USER];
    console.log('user', user);
    return data ? user?.[data] : user;
  },
) as any;
