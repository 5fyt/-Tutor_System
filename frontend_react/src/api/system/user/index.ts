import httpService, { IOptions } from '@/api/index';
enum USER_URL {
  addUser = '/user/add',
  searchUser = '/user/search',
  updateUser = '/user/update',
  deleteUser = '/user/delete',
  getRoleList = '/role/list',
  getList = '/user/list',
  getNotice = '/notice/list',
  deleteNotice = '/notice/delete'
}
//添加用户
export const addUser = (params: API.UserAddParams, options?: IOptions) => {
  return httpService.post({ url: USER_URL.addUser, data: params }, options);
};
//查询用户
export const searchUser = (params: API.UserAddParams, options?: IOptions) => {
  return httpService.post<API.UserPageResult<API.PageItem>>({ url: USER_URL.searchUser, data: params }, options);
};
//更新用户
export const updateUser = (params: API.UserUpdateParams, options?: IOptions) => {
  return httpService.post({ url: USER_URL.updateUser, data: params }, options);
};
//删除用户
export const deleteUser = (params: API.UserDelParams, options?: IOptions) => {
  return httpService.post({ url: USER_URL.deleteUser, data: params }, options);
};
export const deleteMessage = (params: API.MessageDelParams, options?: IOptions) => {
  return httpService.post({ url: USER_URL.deleteNotice, data: params }, options);
};
//获取角色列表
export const getRoleList = () => {
  return httpService.get({ url: USER_URL.getRoleList });
};
export const getUserList = () => {
  return httpService.get({ url: USER_URL.getList });
};
export const getNoticeList = () => {
  return httpService.get({ url: USER_URL.getNotice });
};
