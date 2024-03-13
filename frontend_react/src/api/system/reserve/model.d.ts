declare namespace API {
  type ReserveAddParams = {
    tutorId: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    detailAddress: string;
  };
  type ReserveSearchParams = {
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
  };
  type ReserveDelParams = {
    reserveIds: number[];
  };
  type ReserveUpdateParams = {
    id: number;
    tutorId: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    detailAddress: string;
  };
  type ReserveStatusParams = {
    id: number;
    status: number;
  };
}
