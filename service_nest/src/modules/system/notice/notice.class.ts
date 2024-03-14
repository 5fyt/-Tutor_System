import { ApiProperty } from '@nestjs/swagger';
import SysNotice from 'src/entities/notice.entity';
export class NoticeInfo {
  @ApiProperty({
    type: SysNotice,
  })
  messageInfo: SysNotice;
}
