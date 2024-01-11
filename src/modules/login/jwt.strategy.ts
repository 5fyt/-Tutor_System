import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('authSecret.secret'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userId,
      userName: payload.userName,
      // authList: payload.authList,
      roleId: payload.roleId,
    };
  }
}
