import { ApiProperty } from '@nestjs/swagger';

import SysRole from 'src/entities/role.entity';

export class RoleInfo {
  @ApiProperty({
    type: SysRole,
  })
  roleInfo: SysRole;
}
export class CreateRoleId {
  roleId: number;
}
