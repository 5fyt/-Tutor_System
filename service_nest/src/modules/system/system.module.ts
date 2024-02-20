import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysRole from 'src/entities/role.entity';
import SysUserRole from 'src/entities/user-role.entity';
import SysUser from 'src/entities/user.entity';
import { SysRoleController } from './role/role.controller';
import { SysRoleService } from './role/role.service';
import { SysUserController } from './user/user.controller';
import { SysUserService } from './user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([SysUser, SysUserRole, SysRole])],
  controllers: [SysUserController, SysRoleController],
  providers: [SysUserService, SysRoleService],
  exports: [TypeOrmModule, SysUserService],
})
export class SystemModule {}
