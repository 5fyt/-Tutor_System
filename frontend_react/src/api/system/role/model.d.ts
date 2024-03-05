declare namespace API {
  type RoleAddParams = {
    name: string;
    remark: string;
  };
  type RoleSearchParams = {
    page: number;
    limit: number;
  };
  type RoleDeleteParams = {
    roleIds: number[];
  };
  type RoleUpdateParams = {
    id: number;
    name: string;
    remark: string;
  };
  type RoleInfoParams = {
    id: number;
  };
}
