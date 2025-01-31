import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Like, Repository } from 'typeorm';
import {
  CreateReserveDto,
  UpdateReserveDto,
  PageSearchReserveDto,
  UpdateReserveStatusDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './reserve.dto';
import SysReserve, { ReserveStatus } from 'src/entities/reserve.entity';
import { SysNoticeService } from '../notice/notice.service';
import { ApiException } from 'src/common/exceptions/api.exception';
// import { CourseList } from './course.class';
@Injectable()
export class SysReserveService {
  constructor(
    @InjectRepository(SysReserve)
    private reserveRepository: Repository<SysReserve>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private noticeService: SysNoticeService,
  ) {}
  async getReserveInfo(reId: number): Promise<SysReserve> {
    return await this.reserveRepository.findOne({
      where: { tutorId: reId },
    });
  }
  /**
   * 确定预约
   */
  async confirmReserve(param: UpdateReserveStatusDto): Promise<void> {
    const info = await this.getReserveInfo(param.id);
    if (info.status === ReserveStatus.reserved) {
      throw new ApiException(10005);
    }
    return await this.entityManager.transaction(async (manager) => {
      await manager.update(
        SysReserve,
        { tutorId: param.id },
        {
          status: ReserveStatus.reserved,
        },
      );
      await this.noticeService.add('你确定了预约');
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

  /**
   * 分页查询待评论的预约单
   */
  async pageByStatus(
    param: PageSearchReserveDto,
  ): Promise<[SysReserve[], number]> {
    const { limit, page } = param;

    const qb = await this.reserveRepository
      .createQueryBuilder('reserve')
      .innerJoinAndSelect('sys_tutor', 'tutor', 'reserve.tutorId=tutor.id')
      // .innerJoinAndSelect('sys_user', 'user')
      .innerJoinAndSelect('sys_user', 'user', 'tutor.userId=user.id')
      .innerJoinAndSelect(
        'sys_user_role',
        'user_role',
        'user_role.user_id = user.id',
      )
      .innerJoinAndSelect('sys_role', 'role', 'role.id = user_role.role_id')
      .select([
        'reserve.*',
        'reserve.id',
        'tutor.course,tutor.grade',
        'role',
        'user.*',
      ])
      .where('reserve.status = :status', { status: '1' })
      .andWhere('role.name NOT IN (:...role)', {
        role: ['student'],
      })
      .orderBy('reserve.updated_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const [_, total] = await qb.getManyAndCount();
    const list = await qb.getRawMany();
    console.log(list);
    return [list, total];
  }

  //当前角色是教师的，确定预约的
  async pageByRole(
    param: PageSearchReserveDto,
  ): Promise<[SysReserve[], number]> {
    const { limit, page } = param;
    const qb = await this.reserveRepository
      .createQueryBuilder('reserve')
      .innerJoinAndSelect('sys_tutor', 'tutor', 'reserve.tutorId=tutor.id')
      // .innerJoinAndSelect('sys_user', 'user')
      .innerJoinAndSelect('sys_user', 'user', 'tutor.userId=user.id')
      .innerJoinAndSelect(
        'sys_user_role',
        'user_role',
        'user_role.user_id = user.id',
      )
      .innerJoinAndSelect('sys_role', 'role', 'role.id = user_role.role_id')
      .select(['reserve.*', 'tutor.course,tutor.grade', 'role', 'user.*'])
      .where('reserve.status = :status', { status: '1' })
      .andWhere('role.name NOT IN (:...role)', {
        role: ['teacher'],
      })
      .orderBy('reserve.updated_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const [_, total] = await qb.getManyAndCount();
    const list = await qb.getRawMany();
    console.log(list);
    return [list, total];
  }
  /**
   * 根据课程Id数组删除
   */
  async deleteComment(reserveIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await reserveIds.forEach(async (id) => {
        await manager.update(SysReserve, id, {
          comment: '',
          score: '',
        });
      });
    });
  }

  /**
   * 增加评论记录
   */
  async addComment(param: UpdateCommentDto): Promise<void> {
    const { comment, score, id } = param;

    await this.reserveRepository.update(
      {
        id: id,
      },
      {
        comment,
        score,
      },
    );
  }

  /**
   * 更新课程信息
   */
  async updateComment(param: UpdateCommentDto): Promise<void> {
    const { comment, score } = param;
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysReserve, param.id, {
        comment,
        score,
      });
    });
  }
}
