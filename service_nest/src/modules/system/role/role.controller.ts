import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/common/class/res.class';
import SysRole from 'src/entities/role.entity';

import { ListRole, RoleInfo } from './role.class';
import {
  CreateRoleDto,
  DeleteRoleDto,
  PageSearchRoleDto,
  UpdateRoleDto,
  InfoRoleDto,
} from './role.dto';
import { SysRoleService } from './role.service';
// import { AdminUser } from 'src/decorators/admin-user.decorator';
// import { IAdminUser } from 'src/modules/admin.interface';

@ApiTags('角色模块')
@Controller('role')
export class SysRoleController {
  constructor(private roleService: SysRoleService) {}

  @ApiOperation({ summary: '分页查询角色信息' })
  @ApiOkResponse({ type: [SysRole] })
  @Post('search')
  async page(
    @Body() dto: PageSearchRoleDto,
  ): Promise<PaginatedResponseDto<SysRole>> {
    const [list, total] = await this.roleService.page(dto);
    return {
      size: dto.limit,
      page: dto.page,
      total,
      list,
    };
  }
  @ApiOperation({ summary: '角色列表' })
  @Get('list')
  async getRoleList(): Promise<ListRole[]> {
    const list = await this.roleService.roleInfoList();
    return list.map((item) => {
      return { id: item.id, name: item.name, label: item.remark };
    });
  }

  @ApiOperation({ summary: '删除角色' })
  @Post('delete')
  async delete(@Body() dto: DeleteRoleDto): Promise<void> {
    await this.roleService.delete(dto.roleIds);
  }

  @ApiOperation({ summary: '新增角色' })
  @Post('add')
  async add(@Body() dto: CreateRoleDto): Promise<void> {
    await this.roleService.add(dto);
  }

  @ApiOperation({ summary: '更新角色' })
  @Post('update')
  async update(@Body() dto: UpdateRoleDto): Promise<void> {
    await this.roleService.update(dto);
  }

  @ApiOperation({ summary: '获取角色信息' })
  @ApiOkResponse({ type: RoleInfo })
  @Get('info')
  async info(@Query() dto: InfoRoleDto): Promise<RoleInfo> {
    return await this.roleService.info(dto.roleId);
  }
}
