import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString, MinLength } from 'class-validator';

export class DeleteRoleDto {
  @ApiProperty({
    description: '需要删除的角色id列表',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  roleIds: string[];
}
export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  @MinLength(2)
  name: string;
}
