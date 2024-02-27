import httpService, { IOptions } from '@/api/index';
enum UserURL {
  addUser = '/user/add',
  searchUser = '/user/search',
  updateUser = '/user/update',
  deleteUser = '/user/delete',
  getRoleList = '/role/list'
}
//添加用户
export const addUser = (params: API.UserAddParams, options?: IOptions) => {
  return httpService.post({ url: UserURL.addUser, data: params }, options);
};
//查询用户
export const searchUser = (params: API.UserAddParams, options?: IOptions) => {
  return httpService.post<API.UserPageResult<API.PageItem>>({ url: UserURL.searchUser, data: params }, options);
};
//更新用户
export const updateUser = (params: API.UserUpdateParams, options?: IOptions) => {
  return httpService.post({ url: UserURL.updateUser, data: params }, options);
};
//删除用户
export const deleteUser = (params: API.UserDelParams, options?: IOptions) => {
  return httpService.post({ url: UserURL.deleteUser, data: params }, options);
};
//获取角色列表
export const getRoleList = () => {
  return httpService.get({ url: UserURL.getRoleList });
};
