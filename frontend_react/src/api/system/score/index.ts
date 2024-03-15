import httpService, { IOptions } from '@/api/index';
enum Score_URL {
  add_course = '/score/add',
  course_search = '/score/search',
  update_course = '/score/update',
  delete_course = '/score/delete'
}
//添加成绩列表
export const addScore = (params: API.ScoreAddParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.add_course, data: params }, options);
};
//查询成绩
export const searchScoreList = (params: API.ScoreSearchParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.course_search, data: params }, options);
};
//更新成绩
export const updateScore = (params: API.ScoreUpdateParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.update_course, data: params }, options);
};
//删除成绩
export const deleteScore = (params: API.ScoreDeleteParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.delete_course, data: params }, options);
};
