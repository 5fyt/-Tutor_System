import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';
export class DeleteNoticeDto {
  @ApiProperty({
    description: '需要删除的消息id列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  messageIds: number[];
}
