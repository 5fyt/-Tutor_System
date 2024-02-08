import { ApiProperty } from '@nestjs/swagger';
import { Column, OneToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
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

  @OneToOne(() => SysUser, (user) => user.role)
  user: SysUser;
}
