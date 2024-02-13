import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import SysUser from '../user/user.entity';

@Entity({ name: 'sys_role' })
export default class SysRole {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, default: '' })
  remark: string;

  @ManyToMany(() => SysUser, (user) => user.role)
  @JoinTable({ name: 'sys_user_role' })
  user: SysUser[];
}
