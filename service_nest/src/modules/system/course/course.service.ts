import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/common/exceptions/api.exception';
import SysCourse from 'src/entities/course.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import {
  CreateCourseDto,
  UpdateCourseDto,
  PageSearchCourseDto,
} from './course.dto';
import { CourseList } from './course.class';
@Injectable()
export class SysCourseService {
  constructor(
    @InjectRepository(SysCourse)
    private courseRepository: Repository<SysCourse>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * 获取课程列表
   */
  async courseInfoList(): Promise<CourseList> {
    const list = await this.courseRepository.find();
    const map = new Map();
    const courseList = list
      .map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      })
      .filter((v) => !map.has(v.label) && map.set(v.label, 1));
    const gradeList = list
      .map((item) => {
        return {
          value: item.id,
          label: item.grade,
        };
      })
      .filter((v) => !map.has(v.label) && map.set(v.label, 1));
    return { courseList, gradeList };
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
    const { name, grade, description } = param;
    const existname = await this.courseRepository.findOne({
      where: { name },
    });
    const existgrade = await this.courseRepository.findOne({
      where: { grade },
    });
    if (existname && existgrade) {
      throw new ApiException(10004);
    }
    await this.courseRepository.insert({
      name,
      grade,
      description,
    });
  }

  /**
   * 更新课程信息
   */
  async update(param: UpdateCourseDto): Promise<void> {
    const existname = await this.courseRepository.findOne({
      where: { name: param.name },
    });
    const existgrade = await this.courseRepository.findOne({
      where: { grade: param.grade },
    });
    if (existname && existgrade) {
      throw new ApiException(10004);
    }
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysCourse, param.id, {
        name: param.name,
        grade: param.grade,
        description: param.description,
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
