export class CreateUserDto {
  userName: string;
  password: string;
  avatar: string;
  roleId: number;
  nickName: string;
  email: string;
  phone: string;
}
export class AddUserRoleDto {
  /** 用户id */
  userId: number;
  /** 角色id */
  roleId: number;
}
