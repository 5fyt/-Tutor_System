import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sys_achievement' })
export default class SysAchievement {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ default: 0 })
  userId: number;

  @Column({ unique: true })
  usualGrades: string;

  @Column({ nullable: true, default: '' })
  comments: string;

  @Column({ nullable: true, default: '' })
  classResult: string;

  @Column({ nullable: true, default: '' })
  allScore: string;

  @Column({ nullable: true, default: false })
  isShow: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
