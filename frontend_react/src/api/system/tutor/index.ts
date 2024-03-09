import httpService, { IOptions } from '@/api/index';
enum TUTOR_URL {
  add_tutor = '/tutor/add',
  tutor_list = '/tutor/search',
  update_tutor = '/tutor/update',
  delete_tutor = '/tutor/delete',
  update_status = 'tutor/changeStatus'
  // role_info = '/role/info',
  // perm_list = '/role/permission'
}
//查询家教信息
export const getTutorList = (params: API.TutorSearchParams, options?: IOptions) => {
  return httpService.post({ url: TUTOR_URL.tutor_list, data: params }, options);
};
//删除家教信息
export const deleteTutor = (params: API.TutorDelParams, options?: IOptions) => {
  return httpService.post({ url: TUTOR_URL.delete_tutor, data: params }, options);
};
//新增家教信息
export const addTutor = (params: API.TutorAddParams, options?: IOptions) => {
  return httpService.post({ url: TUTOR_URL.add_tutor, data: params }, options);
};
//更新家教信息
export const updateTutor = (params: API.UserUpdateParams, options?: IOptions) => {
  return httpService.post({ url: TUTOR_URL.update_tutor, data: params }, options);
};
//上下架家教信息
export const updateTutorStatus = (params: API.TutorStatusParams, options?: IOptions) => {
  return httpService.post({ url: TUTOR_URL.update_status, data: params }, options);
};
