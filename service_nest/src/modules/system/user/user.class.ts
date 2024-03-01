import { ApiProperty } from '@nestjs/swagger';
import SysUser from 'src/entities/user.entity';

export class AccountInfo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  headImg: string;

  @ApiProperty()
  role: string[];

  @ApiProperty()
  loginIp: string;
}
export class ProfileInfoUrl {
  url: string;
}
export class PageSearchUserInfo {
  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  headImg: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({
    type: [String],
  })
  roleNames: string[];
}

export class UserDetailInfo extends SysUser {
  @ApiProperty({
    description: '关联角色',
  })
  roles: number[];
}
