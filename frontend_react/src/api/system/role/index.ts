import httpService, { IOptions } from '@/api/index';
enum ROLE_URL {
  add_role = '/role/add'
}
export const addRole = (params: API.RoleAddParams, options: IOptions) => {
  return httpService.post({ url: ROLE_URL.add_role, data: params }, options);
};
