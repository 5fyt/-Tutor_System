import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager, Like } from 'typeorm';
import SysTutor from 'src/entities/tutor-info.entity';
import { SysUserService } from '../user/user.service';
import { SysRoleService } from '../role/role.service';
import {
  CreateTutorDto,
  PageBaiscSeachDto,
  PageSearchTutorDto,
  UpdateTutorDto,
  UpdateTutorStatusDto,
} from './tutor.dto';
import { PageSearchTutorInfo } from './tutor.class';
@Injectable()
export class SysTutorService {
  constructor(
    @InjectRepository(SysTutor) private tutorRepository: Repository<SysTutor>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private userService: SysUserService,
    private roleService: SysRoleService,
  ) {}
  /**
   * 根据课程Id数组删除
   */
  async delete(tutorIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysTutor, tutorIds);
    });
  }

  /* 根据角色信息获取家教信息
  当前用户除了是管理员，查找除了当前用户外和当前角色所发布的家教信息
   */
  async pageByrole(
    param: PageBaiscSeachDto,
    uid: number,
  ): Promise<[PageSearchTutorInfo[], number]> {
    const roles: number[] = await this.roleService.getRoleIdByUser(uid);
    const roleNamePromises: Promise<string>[] = roles.map(async (role) => {
      const { roleInfo } = await this.roleService.info(role);
      return roleInfo?.name;
    });
    const roleName: string[] = await Promise.all(roleNamePromises);

    const { limit, page } = param;

    const qb = await this.tutorRepository
      .createQueryBuilder('tutor')
      .innerJoinAndSelect('sys_user', 'user', 'user.id=tutor.userId')
      .innerJoinAndSelect(
        'sys_user_role',
        'user_role',
        'user_role.user_id = user.id',
      )
      .innerJoinAndSelect('sys_role', 'role', 'role.id = user_role.role_id')
      .select([
        'role.name as roleNames',
        'user.phone',
        'user.email',
        'user.headImg',
        'user.name',
        'tutor.*',
      ])
      .where('user.id NOT IN (:...ids)', { ids: [uid] })
      .andWhere('role.name NOT IN (:...role)', {
        role: [roleName.slice(0, 1)[0]],
      })
      // .andWhere('tutor.status=:status',{status:1})
      .orderBy('user.updated_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const [_, total] = await qb.getManyAndCount();
    const list = await qb.getRawMany();

    return [list, total];
  }
  /**
   * 增加课程
   */
  async add(param: CreateTutorDto): Promise<void> {
    const { course, grade, description, address, userId, money } = param;
    await this.tutorRepository.insert({
      userId,
      course,
      grade,
      address,
      description,
      money,
    });
  }

  /**
   * 更新课程信息
   */
  async update(param: UpdateTutorDto): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysTutor, param.id, {
        userId: param.userId,
        address: param.address,
        grade: param.grade,
        course: param.course,
        description: param.description,
        money: param.money,
      });
    });
  }
  /**
   * 上架，下架课程信息
   */
  async updateStatus(param: UpdateTutorStatusDto): Promise<void> {
    console.log('param', param);
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysTutor, param.id, {
        status: param.status,
      });
    });
  }
  /**
   * 分页加载课程信息
   */
  async page(
    param: PageSearchTutorDto,
    uid: number,
  ): Promise<[PageSearchTutorInfo[], number]> {
    const { limit, page, course, grade } = param;

    const [list, total] = await this.tutorRepository.findAndCount({
      where: {
        course: Like(`%${course}%`),
        grade: Like(`%${grade}%`),
        userId: uid,
      },
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    const filterList = await Promise.all(
      list.map(async (item) => {
        const { name } = await this.userService.info(item.userId);
        const { userId, updatedAt, ...other } = item;
        return { ...other, name };
      }),
    );
    return [filterList, total];
  }
}
