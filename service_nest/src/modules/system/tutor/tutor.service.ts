import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager, Like } from 'typeorm';
import SysTutor from 'src/entities/tutor-info.entity';
import { SysUserService } from '../user/user.service';
import {
  CreateTutorDto,
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
  ) {}
  /**
   * 根据课程Id数组删除
   */
  async delete(tutorIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysTutor, tutorIds);
    });
  }

  /* 根据角色信息获取家教信息 */
  async getTutorByRole(role: string) {}
  /**
   * 增加课程
   */
  async add(param: CreateTutorDto): Promise<void> {
    const { course, grade, description, address, userId } = param;
    await this.tutorRepository.insert({
      userId,
      course,
      grade,
      address,
      description,
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
  ): Promise<[PageSearchTutorInfo[], number]> {
    const { limit, page, course, grade } = param;

    const [list, total] = await this.tutorRepository.findAndCount({
      where: {
        course: Like(`%${course}%`),
        grade: Like(`%${grade}%`),
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
