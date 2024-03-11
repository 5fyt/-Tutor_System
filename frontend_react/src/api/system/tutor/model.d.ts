declare namespace API {
  type TutorAddParams = {
    userId: number;
    grade: number;
    course: number;
    address: string;
    description?: string;
  };
  type TutorSearchParams = {
    page: number;
    limit: number;
    grade?: string;
    course?: string;
    status?: number;
  };
  type TutorDelParams = {
    tutorIds: number[];
  };
  type TutorUpdateParams = {
    id: number;
    userId: number;
    grade: number;
    course: number;
    address: string;
    description?: string;
  };
  type TutorStatusParams = {
    id: number;
    status: number;
  };
}
