import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Like, Repository } from 'typeorm';
import {
  CreateReserveDto,
  UpdateReserveDto,
  PageSearchReserveDto,
  UpdateReserveStatusDto,
} from './reserve.dto';
import SysReserve from 'src/entities/reserve.entity';
// import { CourseList } from './course.class';
@Injectable()
export class SysReserveService {
  constructor(
    @InjectRepository(SysReserve)
    private reserveRepository: Repository<SysReserve>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * 确定预约
   */
  async confirmReserve(param: UpdateReserveStatusDto): Promise<void> {
    return await this.entityManager.transaction(async (manager) => {
      await manager.update(SysReserve, param.id, {
        status: 1,
      });
    });
  }
  /**
   * 根据课程Id数组删除
   */
  async delete(reserveIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysReserve, reserveIds);
    });
  }

  /**
   * 增加课程
   */
  async add(param: CreateReserveDto, uid: number): Promise<void> {
    const { startDate, startTime, endDate, endTime, detailAddress, tutorId } =
      param;
    console.log('re', uid);
    await this.reserveRepository.insert({
      userId: uid,
      tutorId,
      startDate,
      startTime,
      endDate,
      endTime,
      detailAddress,
    });
  }

  /**
   * 更新课程信息
   */
  async update(param: UpdateReserveDto, uid: number): Promise<void> {
    const { startDate, startTime, endDate, endTime, detailAddress, tutorId } =
      param;
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysReserve, param.id, {
        userId: uid,
        tutorId,
        startDate,
        startTime,
        endDate,
        endTime,
        detailAddress,
      });
    });
  }

  /**
   * 分页加载课程信息
   */
  async page(param: PageSearchReserveDto): Promise<[SysReserve[], number]> {
    const { limit, page, endDate, startDate } = param;
    const qb = await this.reserveRepository
      .createQueryBuilder('reserve')
      .innerJoinAndSelect('sys_tutor', 'tutor', 'reserve.tutorId=tutor.id')
      .select(['reserve.*', 'tutor.grade', 'tutor.course'])
      .where(
        new Brackets((qb) => {
          if (startDate) {
            return qb.where('reserve.startDate LIKE :startDate', {
              startDate: `%${startDate}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (endDate) {
            return qb.where('reserve.endDate LIKE :endDate', {
              endDate: `%${endDate}%`,
            });
          } else {
            return qb;
          }
        }),
      )
      .orderBy('reserve.updated_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const [_, total] = await qb.getManyAndCount();
    const list = await qb.getRawMany();
    return [list, total];
  }
}
