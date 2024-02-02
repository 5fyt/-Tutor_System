import httpService, { IOptions } from '@/api/index';
enum ACCOUNT_API {
  lOGON_OUT = '/logout',
  PROFILE = '/user/info'
}
export const logout = (options?: IOptions) => {
  return httpService.post({ url: ACCOUNT_API.lOGON_OUT }, options);
};
export const getAccount = (options?: IOptions) => {
  return httpService.get<API.AdminUserInfo>({ url: ACCOUNT_API.PROFILE }, options);
};
