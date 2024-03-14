import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysRole from 'src/entities/role.entity';
import SysUserRole from 'src/entities/user-role.entity';
import SysUser from 'src/entities/user.entity';
import SysPerm from 'src/entities/perm.entity';
import SysRolePerm from 'src/entities/role-perm.entity';
import SysTutor from 'src/entities/tutor-info.entity';
import SysCourse from 'src/entities/course.entity';
import { SysUserService } from './user/user.service';
import { SysRoleService } from './role/role.service';
import { SysCourseService } from './course/course.service';
import { SysTutorService } from './tutor/tutor.service';
import { SysReserveService } from './reserve/reserve.service';
import { SysCourseController } from './course/course.controller';
import { SysTutorController } from './tutor/tutor.controller';
import { SysRoleController } from './role/role.controller';
import { SysUserController } from './user/user.controller';
import { SysReserveController } from './reserve/reserve.controller';
import SysReserve from 'src/entities/reserve.entity';
import SysNotice from 'src/entities/notice.entity';
import { SysNoticeController } from './notice/notice.controller';
import { SysNoticeService } from './notice/notice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysRolePerm,
      SysUser,
      SysPerm,
      SysRole,
      SysUserRole,
      SysCourse,
      SysTutor,
      SysReserve,
      SysNotice,
    ]),
  ],
  controllers: [
    SysUserController,
    SysRoleController,
    SysCourseController,
    SysTutorController,
    SysReserveController,
    SysNoticeController,
  ],
  providers: [
    SysUserService,
    SysRoleService,
    SysCourseService,
    SysTutorService,
    SysReserveService,
    SysNoticeService,
  ],
  exports: [
    TypeOrmModule,
    SysUserService,
    SysRoleService,
    SysTutorService,
    SysNoticeService,
  ],
})
export class SystemModule {}
