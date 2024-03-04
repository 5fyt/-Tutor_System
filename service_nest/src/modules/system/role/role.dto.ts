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
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteRoleDto {
  @ApiProperty({
    description: '需要删除的角色id列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  roleIds: number[];
}
export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  @MinLength(2)
  name: string;
  @ApiProperty({
    description: '角色备注',
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    description: '拥有权限',
    type: [Number],
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  permissionIds: number[];
}
export class PageSearchRoleDto {
  @ApiProperty({
    required: false,
    description: '角色名称',
  })
  @IsString()
  @IsOptional()
  name = '';

  @ApiProperty({
    required: false,
    description: '备注',
  })
  @IsString()
  @IsOptional()
  remark = '';
  @ApiProperty({
    description: '当前页包含数量',
    required: false,
    default: 3,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number = 3;

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
export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({
    description: '关联部门编号',
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
