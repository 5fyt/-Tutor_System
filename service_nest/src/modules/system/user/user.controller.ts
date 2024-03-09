import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/class/res.class';
import { ADMIN_PREFIX } from 'src/guards/constants/admin.contants';
import { IAdminUser } from '../../admin.interface';
import { AdminUser } from '../../../decorators/admin-user.decorator';
import {
  CreateUserDto,
  DeleteUserDto,
  PageSearchUserDto,
  UpdateUserDto,
  UpdateAccountDto,
  UpdatePasswordDto,
} from './user.dto';
import {
  AccountInfo,
  PageSearchUserInfo,
  ProfileInfoUrl,
  UserDetailInfo,
} from './user.class';
import { SysUserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('管理员模块')
@Controller('user')
export class SysUserController {
  constructor(private userService: SysUserService) {}

  @ApiOperation({
    summary: '新增管理员',
  })
  @Post('add')
  async add(@Body() dto: CreateUserDto): Promise<void> {
    await this.userService.add(dto);
  }
  @ApiOperation({
    summary: '用户列表',
  })
  @Get('list')
  async getUserList() {
    const list = await this.userService.findUserList();
    return list.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  }

  // @ApiOperation({
  //   summary: '查询管理员信息',
  // })
  @ApiOkResponse({ type: UserDetailInfo })
  @Get('info')
  async info(@AdminUser() user: IAdminUser): Promise<AccountInfo> {
    return await this.userService.getAccountInfo(user.uid);
  }

  @ApiOperation({
    summary: '根据ID列表删除管理员',
  })
  @Post('delete')
  async delete(@Body() dto: DeleteUserDto): Promise<void> {
    await this.userService.delete(dto.userIds);
    await this.userService.multiForbidden(dto.userIds);
  }

  @ApiOperation({
    summary: '分页获取管理员列表',
  })
  @ApiOkResponse({ type: [PageSearchUserInfo] })
  @Post('search')
  async page(
    @Body() dto: PageSearchUserDto,
    @AdminUser() user: IAdminUser,
  ): Promise<PaginatedResponseDto<PageSearchUserInfo>> {
    const [list, total] = await this.userService.page(user.uid, dto);
    return {
      total,
      page: dto.page,
      size: dto.limit,
      list,
    };
  }

  @ApiOperation({
    summary: '管理员更新用户信息',
  })
  @Post('update')
  async update(@Body() dto: UpdateUserDto): Promise<void> {
    await this.userService.update(dto);
    // await this.menuService.refreshPerms(dto.id);
  }

  @ApiOperation({
    summary: '更新用户信息',
  })
  @Post('profile/update')
  async updateUser(@Body() dto: UpdateAccountDto): Promise<void> {
    await this.userService.userUpdate(dto);
    // await this.menuService.refreshPerms(dto.id);
  }
  //上传头像
  @ApiOperation({
    summary: '上传头像',
  })
  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file,
    @AdminUser() user: IAdminUser,
  ): Promise<ProfileInfoUrl> {
    const url = await this.userService.uploadAvatar(file, user.uid);
    return { url };
  }

  @ApiOperation({
    summary: '更新用户密码',
  })
  @Post('password')
  async changeUserPassword(
    @Body() dto: UpdatePasswordDto,
    @AdminUser() user: IAdminUser,
  ) {
    await this.userService.updatePassword(user.uid, dto);
  }
}
