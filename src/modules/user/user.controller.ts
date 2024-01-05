import { Controller, LoggerService, Inject, Get } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('log init');
  }
  @Get()
  getUserInfo() {
    return {
      code: 200,
      message: 'success',
    };
  }
}
