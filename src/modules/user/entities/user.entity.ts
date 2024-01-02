import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({ unique: true })
  @Length(8, 20)
  userName: string;

  @Column()
  @Length(8, 20)
  password: string;

  @Column({ nullable: true })
  nickName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn({ name: 'create_time', nullable: true })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date | null;

  @DeleteDateColumn({ name: 'delete_time', nullable: true })
  deleteTime: Date | null;
}
