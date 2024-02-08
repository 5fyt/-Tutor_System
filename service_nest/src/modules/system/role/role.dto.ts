import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dto/page.dto';
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
}
export class PageSearchRoleDto extends PageOptionsDto {
  @ApiProperty({
    required: false,
    description: '角色名称',
  })
  @IsString()
  @IsOptional()
  name = '';

  @ApiProperty({
    required: false,
    description: '角色唯一标识',
  })
  @IsString()
  @IsOptional()
  label = '';

  @ApiProperty({
    required: false,
    description: '备注',
  })
  @IsString()
  @IsOptional()
  remark = '';
}
export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({
    description: '关联部门编号',
  })
  @IsInt()
  @Min(0)
  roleId: number;
}
export class InfoRoleDto {
  @ApiProperty({
    description: '需要查找的角色ID',
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  roleId: number;
}
