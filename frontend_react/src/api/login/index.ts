import httpService, { IOptions } from '@/api/index';
enum LOGIN_API {
  LOGIN = '/login',
  CAPTCHA_IMG = '/captcha/img'
}

//获取验证码
export const getCode = (params?: API.CaptChaParams, options?: IOptions) => {
  return httpService.get<API.CaptChaResult>({ url: LOGIN_API.CAPTCHA_IMG, params }, options);
};

/**
 *
 * @param param
 * @param options
 * @returns
 */
export const login = (params: API.LoginParams, options?: IOptions) => {
  return httpService.post({ url: LOGIN_API.LOGIN, data: params }, options);
};
