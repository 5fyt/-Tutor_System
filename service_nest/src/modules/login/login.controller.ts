import { Controller, Post, Body, HttpCode, Get, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginFormParams } from './login-auth.dto';

@Controller()
export class LoginController {
  constructor(private readonly authService: LoginService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() createAuthDto: LoginFormParams) {
    return this.authService.login(createAuthDto);
  }

  @Post('/updateToken')
  async refreshToken(@Body() updateToken: { refreshToken: string }) {
    return this.authService.refreshToken(updateToken.refreshToken);
  }

  @Get('list')
  @HttpCode(200)
  getAuthList(@Req() req: any) {
    console.log(req.user);
  }
}
