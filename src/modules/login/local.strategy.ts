import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginFormParams } from './login-auth.dto';
import { ApiException } from 'src/common/exceptions/api.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: LoginService) {
    super();
  }

  async validate(loginForm: LoginFormParams): Promise<any> {
    const user = await this.authService.login(loginForm);
    if (!user) {
      throw new ApiException(11003);
    }
    return user;
  }
}
