import { ApiProperty } from '@nestjs/swagger';

export class PageSearchTutorInfo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  grade: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  course: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  publishTime: Date;

  @ApiProperty()
  name: string;
}
