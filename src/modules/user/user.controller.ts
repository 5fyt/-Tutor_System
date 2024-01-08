import {
  Controller,
  Get,
  // ForbiddenException,
} from '@nestjs/common';
import { LoggerService } from 'src/shared/logger/logger.service';

@Controller('user')
export class UserController {
  constructor(private readonly logger: LoggerService) {
    this.logger.log('sssslog init');
  }
  @Get()
  getUserInfo() {
    this.logger.log('ssss');
    this.logger.error('error');
    // throw new ForbiddenException();
    return {
      data: 'user info',
    };
    // return {
    //   code: 200,
    //   message: 'success',
    // };
  }
}
