declare namespace API {
  type UserAddParams = {
    name: string;
    username: string;
    roles: number[];
    email?: string;
    phone?: string;
  };
  type UserUpdateParams = {
    id: number;
    name: string;
    username: string;
    roles: number[];
    email?: string;
    phone?: string;
  };
  type UserDelParams = {
    id: number;
  };
  type PageItem = {
    id: number;
    roleNames: string[];
    name: string;
    username: string;
    psalt: string;
    headImg: string;
    email: string;
    phone: string;
    createAt: Date;
    updateAt: Date;
  };
  type UserPageResult<T> = {
    list: T[];
    total: number;
    page: number;
    size: number;
  };
}
