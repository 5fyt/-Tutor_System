declare namespace API {
  type CourseAddParams = {
    name: string;
    grade: string;
  };
  type CourseDeleteParams = {
    courseIds: number[];
  };
  type CourseSearchParams = {
    limit: number;
    page: number;
    name?: string;
    grade?: string;
  };
  type CourseUpdateParams = {
    id: string;
    name: string;
    grade: string;
  };
}
