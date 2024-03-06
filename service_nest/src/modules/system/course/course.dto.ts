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

export class DeleteCourseDto {
  @ApiProperty({
    description: '需要删除的课程id列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  courseIds: number[];
}
export class CreateCourseDto {
  @ApiProperty({
    description: '课程名称',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: '年级',
  })
  @IsString()
  @IsOptional()
  grade: string;

  @ApiProperty({
    description: '课程描述',
  })
  @IsString()
  @IsOptional()
  description: string;
}
export class PageSearchCourseDto {
  @ApiProperty({
    required: false,
    description: '课程名称',
  })
  @IsString()
  @IsOptional()
  name = '';

  @ApiProperty({
    required: false,
    description: '年级',
  })
  @IsString()
  @IsOptional()
  grade = '';

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
export class UpdateCourseDto extends CreateCourseDto {
  @ApiProperty({
    description: '关联课程编号',
  })
  @IsInt()
  @Min(0)
  id: number;
}
