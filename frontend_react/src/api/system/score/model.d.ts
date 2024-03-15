declare namespace API {
  type ScoreAddParams = {
    usualGrades: string;
    comments: string;
    classResult: string;
    allScore: string;
  };
  type ScoreDeleteParams = {
    scoreIds: number[];
  };
  type ScoreSearchParams = {
    limit: number;
    page: number;
    allScore?: string;
  };
  type ScoreUpdateParams = {
    id: string;
    usualGrades: string;
    comments: string;
    classResult: string;
    allScore: string;
  };
}
