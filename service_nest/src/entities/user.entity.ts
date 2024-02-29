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

  @Column({
    name: 'head_img',
    nullable: true,
  })
  @ApiProperty()
  headImg: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  email: string;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
