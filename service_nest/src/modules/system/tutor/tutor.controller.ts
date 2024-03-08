import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/class/res.class';

import {
  CreateTutorDto,
  UpdateTutorDto,
  PageSearchTutorDto,
  DeleteTutorDto,
} from './tutor.dto';

import { SysTutorService } from './tutor.service';
import SysTutor from 'src/entities/tutor-info.entity';
// import { AdminUser } from 'src/decorators/admin-user.decorator';
// import { IAdminUser } from 'src/modules/admin.interface';

@ApiTags('课程模块')
@Controller('tutor')
export class SysTutorController {
  constructor(private tutorService: SysTutorService) {}

  @ApiOperation({ summary: '分页查询家教信息' })
  @ApiOkResponse({ type: [SysTutor] })
  @Post('search')
  async page(
    @Body() dto: PageSearchTutorDto,
  ): Promise<PaginatedResponseDto<SysTutor>> {
    const [list, total] = await this.tutorService.page(dto);
    return {
      size: dto.limit,
      page: dto.page,
      total,
      list,
    };
  }
  //

  @ApiOperation({ summary: '删除家教信息' })
  @Post('delete')
  async delete(@Body() dto: DeleteTutorDto): Promise<void> {
    await this.tutorService.delete(dto.tutorIds);
  }

  @ApiOperation({ summary: '新增家教信息' })
  @Post('add')
  async add(@Body() dto: CreateTutorDto): Promise<void> {
    await this.tutorService.add(dto);
  }

  @ApiOperation({ summary: '更新家教信息' })
  @Post('update')
  async update(@Body() dto: UpdateTutorDto): Promise<void> {
    await this.tutorService.update(dto);
  }
}
