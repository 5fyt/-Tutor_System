import { RoleModule } from '../role/role.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { authSecret } from 'config';

@Module({
  imports: [
    RoleModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: authSecret.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, LocalStrategy, JwtStrategy],
})
export class LoginModule {}
