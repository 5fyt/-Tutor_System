import httpService, { IOptions } from '@/api/index';
enum Score_URL {
  score_list = '/score/list',
  add_score = '/score/add',
  score_search = '/score/search',
  update_score = '/score/update',
  delete_score = '/score/delete',
  search_studentScore = '/score/search-studen-score'
}
//添加成绩列表
export const addScore = (params: API.ScoreAddParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.add_score, data: params }, options);
};
//查询成绩
export const searchScoreList = (params: API.ScoreSearchParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.score_search, data: params }, options);
};
export const searchScoreStudentList = (params: API.ScoreSearchParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.search_studentScore, data: params }, options);
};
//更新成绩
export const updateScore = (params: API.ScoreUpdateParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.update_score, data: params }, options);
};
//删除成绩
export const deleteScore = (params: API.ScoreDeleteParams, options?: IOptions) => {
  return httpService.post({ url: Score_URL.delete_score, data: params }, options);
};
export const getScoreList = () => {
  return httpService.get({ url: Score_URL.score_list });
};
