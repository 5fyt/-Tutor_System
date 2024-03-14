import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export enum ReserveStatus {
  preReserve = 0,
  reserved = 1,
}
@Entity({ name: 'sys_reserve' })
export default class SysReserve {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'tutor_id' })
  tutorId: number;

  @Column({ name: 'startDate', type: 'date' })
  @ApiProperty()
  startDate: string;

  @Column({ type: 'date' })
  @ApiProperty()
  endDate: string;

  @Column({ type: 'time' })
  @ApiProperty()
  startTime: string;

  @Column({ type: 'time' })
  @ApiProperty()
  endTime: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  detailAddress: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  @ApiProperty()
  comment: string;

  @Column({ default: '' })
  @ApiProperty()
  score: string;

  @Column({
    type: 'enum',
    enum: ReserveStatus,
    default: ReserveStatus.preReserve,
  })
  status: ReserveStatus;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
