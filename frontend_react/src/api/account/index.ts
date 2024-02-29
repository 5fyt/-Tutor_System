import httpService, { IOptions } from '@/api/index';
enum ACCOUNT_API {
  lOGON_OUT = '/logout',
  PROFILE = '/user/info',
  UPDATE = '/user/profile/update'
}
export const logout = (options?: IOptions) => {
  return httpService.post({ url: ACCOUNT_API.lOGON_OUT }, options);
};
export const getAccount = (options?: IOptions) => {
  return httpService.get<API.AdminUserInfo>({ url: ACCOUNT_API.PROFILE }, options);
};
export const updateAccount = (params: API.ProfileUpdateParams, options?: IOptions) => {
  return httpService.post({ url: ACCOUNT_API.UPDATE, data: params }, options);
};
