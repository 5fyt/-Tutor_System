import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import SysAchievement from 'src/entities/achievement.entity';
import { EntityManager, Brackets, Repository } from 'typeorm';
import {
  CreateScoreDto,
  UpdateScoreDto,
  PageSearchScoreDto,
} from './achievement.dto';
import { ScoreInfo } from './achievement.class';

@Injectable()
export class SysScoreService {
  constructor(
    @InjectRepository(SysAchievement)
    private scoreRepository: Repository<SysAchievement>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async scoreList(): Promise<ScoreInfo[]> {
    const list = await this.scoreRepository.find();
    const allList = [];
    for (const item of list) {
      console.log(Object.entries(item));
      const transformedArray = Object.entries(item).map(([key, value]) => {
        const whiteArr = ['usualGrades', 'classResult', 'allScore'];
        if (whiteArr.includes(key)) {
          const whiteObj = {
            usualGrades: '平时成绩',
            classResult: '课堂成绩',
            allScore: '总成绩',
          };
          return { name: whiteObj[key], value: value };
        }
      });
      allList.push(transformedArray);
    }
    console.log(allList);
    return allList.map((subArray) =>
      subArray.filter((item) => item !== undefined),
    );
  }
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
    console.log(param);
    const { allScore, usualGrades, classResult, comments, userId } = param;
    console.log(userId);
    await this.scoreRepository.insert({
      userId,
      allScore,
      usualGrades,
      classResult,
      comments,
      isShow: true,
    });
  }

  /**
   * 更新课程信息
   */
  async update(param: UpdateScoreDto): Promise<void> {
    const { allScore, usualGrades, classResult, comments, userId } = param;
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysAchievement, param.id, {
        userId,
        allScore,
        usualGrades,
        classResult,
        comments,
        isShow: true,
      });
    });
  }

  /**
   * 分页加载课程信息
   */
  async page(param: PageSearchScoreDto): Promise<[SysAchievement[], number]> {
    const { limit, page, allScore } = param;
    const qb = await this.scoreRepository
      .createQueryBuilder('score')
      .innerJoinAndSelect('sys_user', 'user', 'score.userId=user.id')
      .innerJoinAndSelect('sys_tutor', 'tutor', 'tutor.userId=user.id')
      .select(['score.*', 'tutor.grade,tutor.course', 'user.name'])
      .orderBy('score.updated_at', 'DESC')
      .where(
        new Brackets((qb) => {
          if (allScore) {
            return qb.where('reserve.startDate LIKE :allScore', {
              allScore: `%${allScore}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .offset((page - 1) * limit)
      .limit(limit);

    const [_, total] = await qb.getManyAndCount();
    const list = await qb.getRawMany();
    return [list, total];
  }

  async pageStudent(
    param: PageSearchScoreDto,
    uid: number,
  ): Promise<[SysAchievement[], number]> {
    const { limit, page, allScore } = param;
    const qb = await this.scoreRepository
      .createQueryBuilder('score')
      .innerJoinAndSelect('sys_user', 'user', 'score.userId=user.id')
      .innerJoinAndSelect('sys_tutor', 'tutor', 'tutor.userId=user.id')
      .select(['score.*', 'tutor.grade,tutor.course', 'user.name'])
      .orderBy('score.updated_at', 'DESC')
      .where(
        new Brackets((qb) => {
          if (allScore) {
            return qb.where('reserve.startDate LIKE :allScore', {
              allScore: `%${allScore}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .andWhere('user.id =:userId', { userId: uid })
      .offset((page - 1) * limit)
      .limit(limit);

    const [_, total] = await qb.getManyAndCount();
    const list = await qb.getRawMany();
    return [list, total];
  }
}
