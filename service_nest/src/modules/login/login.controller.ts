import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { LogDisabled } from 'src/decorators/log-disabled.decorator';
import { ImageCaptchaDto, LoginInfoDto } from './login.dto';
import { ImageCaptcha, LoginToken } from './login.class';
import { LoginService } from './login.service';

@ApiTags('登录模块')
@Controller()
export class LoginController {
  constructor(private loginService: LoginService) {}

  @ApiOperation({
    summary: '获取登录图片验证码',
  })
  @ApiOkResponse({ type: ImageCaptcha })
  @Get('captcha/img')
  @Authorize()
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto);
  }

  @ApiOperation({
    summary: '管理员登录',
  })
  @ApiOkResponse({ type: LoginToken })
  @Post('login')
  @HttpCode(200)
  @LogDisabled()
  @Authorize()
  async login(
    @Body() dto: LoginInfoDto,
    // @Headers('user-agent') ua: string,
  ): Promise<LoginToken> {
    await this.loginService.checkImgCaptcha(dto.captchaId, dto.verifyCode);
    const token = await this.loginService.getLoginSign(
      dto.username,
      dto.password,
      // this.utils.getReqIP(req),
      // ua,
    );

    return { token };
  }
}
