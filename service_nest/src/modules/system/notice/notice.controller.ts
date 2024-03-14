import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import SysNotice from 'src/entities/notice.entity';
import { SysNoticeService } from './notice.service';
import { DeleteNoticeDto } from './notice.dto';

@ApiTags('角色模块')
@Controller('notice')
export class SysNoticeController {
  constructor(private noticeService: SysNoticeService) {}

  @ApiOperation({ summary: '消息列表' })
  @Get('list')
  async getMessageList(): Promise<SysNotice[]> {
    return await this.noticeService.messageList();
  }

  @ApiOperation({ summary: '删除消息' })
  @Post('delete')
  async delete(@Body() dto: DeleteNoticeDto): Promise<void> {
    await this.noticeService.delete(dto.messageIds);
  }
}
