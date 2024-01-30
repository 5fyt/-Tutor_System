declare namespace API {
  type AdminUserInfo = {
    createTime: Date;
    updateTime: Date;
    id: number;
    name: string;
    username: string;
    password: string;
    psalt: string;
    headImg: string;
    email: string;
    phone: string;
  };
}
