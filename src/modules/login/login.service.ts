import { RoleService } from './../role/role.service';
import { authSecret } from '../../../config';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { LoginFormParams } from './login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/shared/logger/logger.service';
@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly loggerService: LoggerService,
  ) {}
  async login(loginParams: LoginFormParams) {
    const user = await this.userService.findOneByUserName(loginParams.userName);
    // const auths = await this.roleService.getAuthList(user.role.id, 'menus');
    // const authList: string[] = [];
    // auths.map((item) => {
    //   if (item.apiPerms === '') return;
    //   if (item.apiPerms === null) return;
    //   authList.push(item.apiPerms);
    // });
    if (user && user.password === loginParams.password) {
      const payload = {
        userName: user.userName,
        userId: user.id,
        roleId: user.role.id,
        // authList,
      };
      this.loggerService.log(`${user.userName} 上线了~`);
      return {
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '8d',
        }),
        token: this.jwtService.sign(payload),
      };
    }
    return null;
  }

  async refreshToken(refreshToken: string) {
    const res = await this.jwtService.verify(refreshToken, {
      secret: authSecret.secret,
    });

    if (res) {
      const user = await this.userService.findOneByUserName(res.userName);
      return await this.login({
        userName: user.userName,
        password: user.password,
      });
    }
    return null;
  }
}
