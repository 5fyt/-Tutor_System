import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteTutorDto {
  @ApiProperty({
    description: '需要删除的课程信息id列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  tutorIds: number[];
}
export class CreateTutorDto {
  @ApiProperty({
    description: '所属用户编号',
  })
  @IsInt()
  @Min(0)
  userId: number;

  @ApiProperty({
    description: '地址',
  })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({
    description: '年级',
  })
  @IsString()
  grade: string;

  @ApiProperty({
    description: '年级',
  })
  @IsNumber()
  money: number;

  @ApiProperty({
    description: '课程',
  })
  @IsString()
  @IsOptional()
  course: string;

  @ApiProperty({
    description: '描述',
  })
  @IsString()
  @IsOptional()
  description: string;
}
export class UpdateTutorStatusDto {
  @ApiProperty({
    description: '状态值',
  })
  @IsInt()
  @Min(0)
  status: number;

  @ApiProperty({
    description: '关联家教信息编号',
  })
  @IsInt()
  @Min(0)
  id: number;
}
export class PageBaiscSeachDto {
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
export class PageSearchTutorDto extends PageBaiscSeachDto {
  @ApiProperty({
    required: false,
    description: '课程',
  })
  @IsString()
  @IsOptional()
  course = '';

  @ApiProperty({
    required: false,
    description: '年级',
  })
  @IsString()
  @IsOptional()
  grade = '';
}
export class UpdateTutorDto extends CreateTutorDto {
  @ApiProperty({
    description: '关联家教信息编号',
  })
  @IsInt()
  @Min(0)
  id: number;
}
export class InfoRoleDto {
  @ApiProperty({
    description: '需要查找的角色ID',
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  id: number;
}
