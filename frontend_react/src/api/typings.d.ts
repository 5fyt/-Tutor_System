declare namespace API {
  //声明表格返回的数据类型
  type TableListResult<T = any> = {
    list: T;
    pagination?: PaginationResult;
  };

  //表格分页返回结果数据类型
  type PaginationResult = {
    total: number;
  };

  //表格请求参数查询参数
  type PageParams<T = any> = {
    limit?: number;
    page?: number;
  } & {
    [P in keyof T]?: T[P];
  };
}
