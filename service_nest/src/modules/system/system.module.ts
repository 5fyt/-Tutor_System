import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysRole from 'src/entities/role.entity';
import SysUserRole from 'src/entities/user-role.entity';
import SysUser from 'src/entities/user.entity';
import SysPerm from 'src/entities/perm.entity';
import SysRolePerm from 'src/entities/role-perm.entity';
import { SysRoleController } from './role/role.controller';
import { SysRoleService } from './role/role.service';
import { SysUserController } from './user/user.controller';
import { SysUserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysRolePerm,
      SysUser,
      SysPerm,
      SysRole,
      SysUserRole,
    ]),
  ],
  controllers: [SysUserController, SysRoleController],
  providers: [SysUserService, SysRoleService],
  exports: [TypeOrmModule, SysUserService, SysRoleService],
})
export class SystemModule {}
