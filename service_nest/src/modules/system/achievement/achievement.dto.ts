import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteScoreDto {
  @ApiProperty({
    description: '需要删除的成绩id列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  scoreIds: number[];
}
export class CreateScoreDto {
  @ApiProperty({
    description: 'userId',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: '平时成绩',
  })
  @IsString()
  usualGrades: string;

  @ApiProperty({
    description: '课堂成绩',
  })
  @IsString()
  classResult: string;

  @ApiProperty({
    description: '总成绩',
  })
  @IsString()
  allScore: string;

  @ApiProperty({
    description: '学生表现',
  })
  @IsString()
  @IsOptional()
  comments: string;
}
export class PageSearchScoreDto {
  @ApiProperty({
    required: false,
    description: '年级',
  })
  @IsString()
  @IsOptional()
  allScore = '';

  @ApiProperty({
    description: '当前页包含数量',
    required: false,
    default: 5,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number = 5;

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
export class UpdateScoreDto extends CreateScoreDto {
  @ApiProperty({
    description: '关联课程编号',
  })
  @IsInt()
  @Min(0)
  id: number;
}
