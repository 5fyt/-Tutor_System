import httpService, { IOptions } from '@/api/index';
enum ROLE_URL {
  add_role = '/role/add',
  role_list = '/role/search',
  update_role = '/role/update',
  delete_role = '/role/delete',
  role_info = '/role/info',
  perm_list = '/role/permission'
}
//添加角色列表
export const addRole = (params: API.RoleAddParams, options?: IOptions) => {
  return httpService.post({ url: ROLE_URL.add_role, data: params }, options);
};
//查询角色
export const getRoleList = (params: API.RoleSearchParams, options?: IOptions) => {
  return httpService.post({ url: ROLE_URL.role_list, data: params }, options);
};
//更新角色
export const updateRole = (params: API.RoleUpdateParams, options?: IOptions) => {
  return httpService.post({ url: ROLE_URL.update_role, data: params }, options);
};
//删除角色
export const deleteRole = (params: API.RoleDeleteParams, options?: IOptions) => {
  return httpService.post({ url: ROLE_URL.delete_role, data: params }, options);
};
//获取权限列表
export const getPermList = (options?: IOptions) => {
  return httpService.get({ url: ROLE_URL.perm_list }, options);
};
//获取角色信息
export const roleInfo = (params: API.RoleInfoParams, options?: IOptions) => {
  return httpService.post({ url: ROLE_URL.role_info, data: params }, options);
};
