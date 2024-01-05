import {
  Controller,
  LoggerService,
  Inject,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('sssslog init');
  }
  @Get()
  getUserInfo() {
    this.logger.log('ssss');
    this.logger.error('error');
    throw new ForbiddenException();
    // return {
    //   code: 200,
    //   message: 'success',
    // };
  }
}
