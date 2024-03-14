import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import SysNotice from 'src/entities/notice.entity';

@Injectable()
export class SysNoticeService {
  constructor(
    @InjectRepository(SysNotice)
    private noticeRepository: Repository<SysNotice>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * 查询所有消息列表
   */
  async messageList(): Promise<SysNotice[]> {
    return await this.noticeRepository.find();
  }

  /**
   * 根据消息Id数组删除
   */
  async delete(messageIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysNotice, messageIds);
    });
  }

  /**
   * 增加消息
   */
  async add(param: string): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.insert(SysNotice, { message: param });
    });
  }
}
