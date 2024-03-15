import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import SysAchievement from 'src/entities/achievement.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import {
  CreateScoreDto,
  UpdateScoreDto,
  PageSearchScoreDto,
} from './achievement.dto';

@Injectable()
export class SysScoreService {
  constructor(
    @InjectRepository(SysAchievement)
    private scoreRepository: Repository<SysAchievement>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * 根据课程Id数组删除
   */
  async delete(scoreIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysAchievement, scoreIds);
    });
  }

  /**
   * 增加课程
   */
  async add(param: CreateScoreDto): Promise<void> {
    const { allScore, usualGrades, classResult, comments } = param;

    await this.scoreRepository.insert({
      allScore,
      usualGrades,
      classResult,
      comments,
    });
  }

  /**
   * 更新课程信息
   */
  async update(param: UpdateScoreDto): Promise<void> {
    const { allScore, usualGrades, classResult, comments } = param;
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysAchievement, param.id, {
        allScore,
        usualGrades,
        classResult,
        comments,
      });
    });
  }

  /**
   * 分页加载课程信息
   */
  async page(param: PageSearchScoreDto): Promise<[SysAchievement[], number]> {
    const { limit, page, allScore } = param;
    const result = await this.scoreRepository.findAndCount({
      where: {
        allScore: Like(`%${allScore}%`),
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
