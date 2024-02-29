declare namespace API {
  type AdminUserInfo = {
    createTime: Date;
    updateTime: Date;
    id: number;
    name: string;
    username: string;
    role: string[];
    password: string;
    psalt: string;
    headImg: string;
    email: string;
    phone: string;
  };
  type ProfileUpdateParams = {
    id: number;
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
  };
}
