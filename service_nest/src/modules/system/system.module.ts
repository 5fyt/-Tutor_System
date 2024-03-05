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
import SysCourse from 'src/entities/course.entity';
import { SysCourseService } from './course/course.service';
import { SysCourseController } from './course/course.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysRolePerm,
      SysUser,
      SysPerm,
      SysRole,
      SysUserRole,
      SysCourse,
    ]),
  ],
  controllers: [SysUserController, SysRoleController, SysCourseController],
  providers: [SysUserService, SysRoleService, SysCourseService],
  exports: [TypeOrmModule, SysUserService, SysRoleService],
})
export class SystemModule {}
