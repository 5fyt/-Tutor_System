import httpService, { IOptions } from '@/api/index';
enum RESERVE_URL {
  add_reserve = '/reserve/add',
  reserve_list = '/reserve/search',
  update_reserve = '/reserve/update',
  delete_reserve = '/reserve/delete',
  update_status = 'reserve/update-status',
  search_list = 'reserve/search-list',
  search_comment = 'reserve/search-comment',
  // role_info = '/role/info',
  // perm_list = '/role/permission'
  add_comment = '/reserve/add-comment',
  update_comment = '/reserve/update-comment',
  delete_comment = '/reserve/delete-comment'
}
//查询预约信息
export const getReserveList = (params: API.ReserveSearchParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.reserve_list, data: params }, options);
};
export const getReserveListByStatus = (params: API.ReserveSearchParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.search_comment, data: params }, options);
};
//删除预约信息
export const deleteReserve = (params: API.ReserveDelParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.delete_reserve, data: params }, options);
};
//新增预约信息
export const addReserve = (params: API.ReserveAddParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.add_reserve, data: params }, options);
};
//更新预约信息
export const updateReserve = (params: API.ReserveUpdateParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.update_reserve, data: params }, options);
};
//确定预约信息
export const updateReserveStatus = (params: API.ReserveStatusParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.update_status, data: params }, options);
};
//删除预约信息
export const deleteComment = (params: API.ReserveDelParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.delete_comment, data: params }, options);
};
//新增预约信息
export const addComment = (params: API.CommentParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.add_comment, data: params }, options);
};
//更新预约信息
export const updateComment = (params: API.CommentParams, options?: IOptions) => {
  return httpService.post({ url: RESERVE_URL.update_comment, data: params }, options);
};
