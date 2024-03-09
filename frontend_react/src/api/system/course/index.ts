import httpService, { IOptions } from '@/api/index';
enum Course_URL {
  add_course = '/course/add',
  course_search = '/course/search',
  update_course = '/course/update',
  delete_course = '/course/delete',
  course_info = '/course/info',
  perm_list = '/course/permission',
  course_list = '/course/list'
}
//添加角色列表
export const addCourse = (params: API.CourseAddParams, options?: IOptions) => {
  return httpService.post({ url: Course_URL.add_course, data: params }, options);
};
//查询角色
export const searchCourseList = (params: API.CourseSearchParams, options?: IOptions) => {
  return httpService.post({ url: Course_URL.course_search, data: params }, options);
};
//更新角色
export const updateCourse = (params: API.CourseUpdateParams, options?: IOptions) => {
  return httpService.post({ url: Course_URL.update_course, data: params }, options);
};
//删除角色
export const deleteCourse = (params: API.CourseDeleteParams, options?: IOptions) => {
  return httpService.post({ url: Course_URL.delete_course, data: params }, options);
};
//课程列表
export const getCourseList = () => {
  return httpService.get({ url: Course_URL.course_list });
};
