import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/common/class/res.class';
import SysRole from './role.entity';

import { RoleInfo } from './role.class';
import {
  CreateRoleDto,
  DeleteRoleDto,
  PageSearchRoleDto,
  UpdateRoleDto,
  InfoRoleDto,
} from './role.dto';
import { SysRoleService } from './role.service';

@ApiTags('角色模块')
@Controller('role')
export class SysRoleController {
  constructor(private roleService: SysRoleService) {}

  @ApiOperation({ summary: '分页查询角色信息' })
  @ApiOkResponse({ type: [SysRole] })
  @Get('search')
  async page(
    @Query() dto: PageSearchRoleDto,
  ): Promise<PaginatedResponseDto<SysRole>> {
    const [list, total] = await this.roleService.page(dto);
    return {
      list,
      pagination: {
        size: dto.limit,
        page: dto.page,
        total,
      },
    };
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
