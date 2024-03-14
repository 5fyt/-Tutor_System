import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteReserveDto {
  @ApiProperty({
    description: '需要删除的预约id列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  reserveIds: number[];
}
export class CreateReserveDto {
  @ApiProperty({
    description: '家教信息id',
  })
  @IsInt()
  @Min(0)
  tutorId: number;

  @ApiProperty({
    description: '起始日期',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: '终止日期',
  })
  @IsString()
  endDate: string;

  @ApiProperty({
    description: '起始时间',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: '终止时间',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: '详细地址',
  })
  @IsString()
  @MinLength(5)
  detailAddress: string;
}
export class PageSearchReserveDto {
  @ApiProperty({
    description: '起始日期',
  })
  @IsString()
  @IsOptional()
  startDate: string;

  @ApiProperty({
    description: '终止日期',
  })
  @IsString()
  @IsOptional()
  endDate: string;

  @ApiProperty({
    description: '当前页包含数量',
    required: false,
    default: 3,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number = 10;

  @ApiProperty({
    description: '当前页包含数量',
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;
}
export class UpdateReserveDto extends CreateReserveDto {
  @ApiProperty({
    description: '关联预约编号',
  })
  @IsInt()
  @Min(0)
  id: number;

  @ApiProperty({
    description: '家教信息id',
  })
  @IsInt()
  @Min(0)
  tutorId: number;
}
export class UpdateReserveStatusDto {
  @ApiProperty({
    description: '关联家教信息编号',
  })
  @IsInt()
  @Min(0)
  id: number;
}
