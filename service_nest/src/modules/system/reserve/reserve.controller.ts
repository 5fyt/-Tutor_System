import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/class/res.class';
import SysReserve from 'src/entities/reserve.entity';
import { SysReserveService } from './reserve.service';
import {
  CreateReserveDto,
  DeleteReserveDto,
  PageSearchReserveDto,
  UpdateReserveDto,
} from './reserve.dto';
import { AdminUser } from 'src/decorators/admin-user.decorator';
import { IAdminUser } from 'src/modules/admin.interface';
// import { AdminUser } from 'src/decorators/admin-user.decorator';
// import { IAdminUser } from 'src/modules/admin.interface';

@ApiTags('课程模块')
@Controller('reserve')
export class SysReserveController {
  constructor(private reserveService: SysReserveService) {}

  @ApiOperation({ summary: '分页查询课程信息' })
  @ApiOkResponse({ type: [SysReserve] })
  @Post('search')
  async page(
    @Body() dto: PageSearchReserveDto,
  ): Promise<PaginatedResponseDto<SysReserve>> {
    const [list, total] = await this.reserveService.page(dto);
    return {
      size: dto.limit,
      page: dto.page,
      total,
      list,
    };
  }
  // @ApiOperation({ summary: '课程列表' })
  // @Get('list')
  // async getRoleList(): Promise<ReserveList> {
  //   return await this.reserveService.ReserveInfoList();
  // }

  @ApiOperation({ summary: '删除课程' })
  @Post('delete')
  async delete(@Body() dto: DeleteReserveDto): Promise<void> {
    await this.reserveService.delete(dto.reserveIds);
  }

  @ApiOperation({ summary: '新增课程' })
  @Post('add')
  async add(
    @Body() dto: CreateReserveDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    await this.reserveService.add(dto, user.uid);
  }

  @ApiOperation({ summary: '更新课程' })
  @Post('update')
  async update(
    @Body() dto: UpdateReserveDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    await this.reserveService.update(dto, user.uid);
  }
}
