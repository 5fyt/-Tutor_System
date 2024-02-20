import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isEmpty, map } from 'lodash';

import SysRole from 'src/entities/role.entity';
import SysUserRole from 'src/entities/user.entity';
import { EntityManager, Like, Repository } from 'typeorm';

import { CreateRoleDto, PageSearchRoleDto, UpdateRoleDto } from './role.dto';
import { CreateRoleId, RoleInfo } from './role.class';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectRepository(SysRole) private roleRepository: Repository<SysRole>,
    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  /**
   * 根据角色获取角色信息
   */
  async info(rid: number): Promise<RoleInfo> {
    const roleInfo = await this.roleRepository.findOne({ where: { id: rid } });
    return { roleInfo };
  }

  /**
   * 根据角色Id数组删除
   */
  async delete(roleIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysRole, roleIds);
    });
  }

  /**
   * 增加角色
   */
  async add(param: CreateRoleDto): Promise<CreateRoleId> {
    const { name, remark } = param;
    const role = await this.roleRepository.insert({
      name,
      remark,
    });
    const { identifiers } = role;
    const roleId = parseInt(identifiers[0].id);
    return { roleId };
  }

  /**
   * 更新角色信息
   */
  async update(param: UpdateRoleDto): Promise<SysRole> {
    const { roleId, name, remark } = param;
    const role = await this.roleRepository.save({
      id: roleId,
      name,
      remark,
    });

    return role;
  }

  /**
   * 分页加载角色信息
   */
  async page(param: PageSearchRoleDto): Promise<[SysRole[], number]> {
    const { limit, page, name, remark } = param;
    const result = await this.roleRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
        remark: Like(`%${remark}%`),
      },
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return result;
  }

  /**
   * 根据用户id查找角色信息
   */
  async getRoleIdByUser(id: number): Promise<number[]> {
    const result = await this.userRoleRepository.find({
      where: {
        id,
      },
    });
    if (!isEmpty(result)) {
      return map(result, (v) => {
        return v.roleId;
      });
    }
    return [];
  }
}
