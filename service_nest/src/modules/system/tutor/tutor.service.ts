import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager, Like } from 'typeorm';
import SysTutor from 'src/entities/tutor-info.entity';
import {
  CreateTutorDto,
  PageSearchTutorDto,
  UpdateTutorDto,
} from './tutor.dto';

@Injectable()
export class SysTutorService {
  constructor(
    @InjectRepository(SysTutor) private tutorRepository: Repository<SysTutor>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}
  /**
   * 根据课程Id数组删除
   */
  async delete(tutorIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysTutor, tutorIds);
    });
  }

  /**
   * 增加课程
   */
  async add(param: CreateTutorDto): Promise<void> {
    const { course, grade, description, address } = param;
    await this.tutorRepository.insert({
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
        address: param.address,
        grade: param.grade,
        course: param.course,
        description: param.description,
      });
    });
  }

  /**
   * 分页加载课程信息
   */
  async page(param: PageSearchTutorDto): Promise<[SysTutor[], number]> {
    const { limit, page, course, grade } = param;
    const result = await this.tutorRepository.findAndCount({
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
    return result;
  }
}
