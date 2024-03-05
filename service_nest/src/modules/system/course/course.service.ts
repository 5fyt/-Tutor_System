import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import SysCourse from 'src/entities/course.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import {
  CreateCourseDto,
  UpdateCourseDto,
  PageSearchCourseDto,
} from './course.dto';

@Injectable()
export class SysCourseService {
  constructor(
    @InjectRepository(SysCourse)
    private courseRepository: Repository<SysCourse>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * 获取角色列表
   */
  async courseInfoList(): Promise<SysCourse[]> {
    return await this.courseRepository.find();
  }

  /**
   * 根据课程Id数组删除
   */
  async delete(courseIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysCourse, courseIds);
    });
  }

  /**
   * 增加课程
   */
  async add(param: CreateCourseDto): Promise<void> {
    const { name, grade } = param;
    await this.courseRepository.insert({
      name,
      grade,
    });
  }

  /**
   * 更新课程信息
   */
  async update(param: UpdateCourseDto): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysCourse, param.id, {
        name: param.name,
        grade: param.grade,
      });
    });
  }

  /**
   * 分页加载课程信息
   */
  async page(param: PageSearchCourseDto): Promise<[SysCourse[], number]> {
    const { limit, page, name, grade } = param;
    const result = await this.courseRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
        grade: Like(`%${grade}%`),
      },
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return result;
  }
}
