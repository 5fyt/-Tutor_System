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
  UpdateReserveStatusDto,
  UpdateCommentDto,
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

  @ApiOperation({ summary: '分页查询待评价信息' })
  @ApiOkResponse({ type: [SysReserve] })
  @Post('search-comment')
  async pageByReserveStatus(
    @Body() dto: PageSearchReserveDto,
  ): Promise<PaginatedResponseDto<SysReserve>> {
    const [list, total] = await this.reserveService.pageByStatus(dto);
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

  @ApiOperation({ summary: '更新预约' })
  @Post('update')
  async update(
    @Body() dto: UpdateReserveDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    await this.reserveService.update(dto, user.uid);
  }

  @ApiOperation({ summary: '删除评论' })
  @Post('delete-comment')
  async deleteComments(@Body() dto: DeleteReserveDto): Promise<void> {
    await this.reserveService.deleteComment(dto.reserveIds);
  }

  @ApiOperation({ summary: '新增评论' })
  @Post('add-comment')
  async addComments(@Body() dto: UpdateCommentDto): Promise<void> {
    await this.reserveService.addComment(dto);
  }

  @ApiOperation({ summary: '更新评论' })
  @Post('update-comment')
  async updateComments(@Body() dto: UpdateCommentDto): Promise<void> {
    await this.reserveService.updateComment(dto);
  }

  @ApiOperation({ summary: '确定预约' })
  @Post('update-status')
  async updateStatus(@Body() dto: UpdateReserveStatusDto): Promise<void> {
    await this.reserveService.confirmReserve(dto);
  }
}
