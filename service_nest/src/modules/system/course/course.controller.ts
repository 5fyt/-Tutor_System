import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/common/class/res.class';
import SysCourse from 'src/entities/course.entity';

import {
  CreateCourseDto,
  UpdateCourseDto,
  PageSearchCourseDto,
  DeleteCourseDto,
} from './course.dto';
import { CourseList } from './course.class';
import { SysCourseService } from './course.service';
// import { AdminUser } from 'src/decorators/admin-user.decorator';
// import { IAdminUser } from 'src/modules/admin.interface';

@ApiTags('课程模块')
@Controller('course')
export class SysCourseController {
  constructor(private courseService: SysCourseService) {}

  @ApiOperation({ summary: '分页查询课程信息' })
  @ApiOkResponse({ type: [SysCourse] })
  @Post('search')
  async page(
    @Body() dto: PageSearchCourseDto,
  ): Promise<PaginatedResponseDto<SysCourse>> {
    const [list, total] = await this.courseService.page(dto);
    return {
      size: dto.limit,
      page: dto.page,
      total,
      list,
    };
  }
  @ApiOperation({ summary: '课程列表' })
  @Get('list')
  async getRoleList(): Promise<CourseList> {
    return await this.courseService.courseInfoList();
  }

  @ApiOperation({ summary: '删除课程' })
  @Post('delete')
  async delete(@Body() dto: DeleteCourseDto): Promise<void> {
    await this.courseService.delete(dto.courseIds);
  }

  @ApiOperation({ summary: '新增课程' })
  @Post('add')
  async add(@Body() dto: CreateCourseDto): Promise<void> {
    await this.courseService.add(dto);
  }

  @ApiOperation({ summary: '更新课程' })
  @Post('update')
  async update(@Body() dto: UpdateCourseDto): Promise<void> {
    await this.courseService.update(dto);
  }
}
