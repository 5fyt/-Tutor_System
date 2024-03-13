import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sys_tutor' })
export default class SysTutor {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ nullable: false })
  @ApiProperty()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  money: number;

  @Column({ nullable: false })
  @ApiProperty()
  grade: string;

  @Column({ nullable: false })
  @ApiProperty()
  course: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @Column({ type: 'tinyint', nullable: true, default: 1 })
  @ApiProperty()
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  publishTime: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
