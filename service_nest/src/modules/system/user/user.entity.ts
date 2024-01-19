import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sys_user' })
export default class SysUser {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'department_id' })
  @ApiProperty()
  departmentId: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({ length: 32 })
  @ApiProperty()
  psalt: string;

  @Column({ name: 'nick_name', nullable: true })
  @ApiProperty()
  nickName: string;

  @Column({ name: 'head_img', nullable: true })
  @ApiProperty()
  headImg: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  email: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  phone: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  remark: string;

  @Column({ type: 'tinyint', nullable: true, default: 1 })
  @ApiProperty()
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}