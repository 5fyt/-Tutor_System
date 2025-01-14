import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { isEmpty, map } from 'lodash';

import SysRole from 'src/entities/role.entity';
import SysUserRole from 'src/entities/user-role.entity';
import SysRolePerm from 'src/entities/role-perm.entity';
import SysPerm from 'src/entities/perm.entity';
import { ApiException } from 'src/common/exceptions/api.exception';
import { EntityManager, Like, Repository } from 'typeorm';

import { CreateRoleDto, PageSearchRoleDto, UpdateRoleDto } from './role.dto';
import { RoleInfo } from './role.class';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectRepository(SysRole) private roleRepository: Repository<SysRole>,
    @InjectRepository(SysRolePerm)
    private rolePermRepository: Repository<SysRolePerm>,
    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    @InjectRepository(SysPerm) private permRepository: Repository<SysPerm>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * 根据角色获取角色信息
   */
  async info(rid: number): Promise<RoleInfo> {
    const roleInfo = await this.roleRepository.findOne({ where: { id: rid } });
    return { roleInfo };
  }

  /**
   * 获取角色列表
   */
  async roleInfoList(): Promise<SysRole[]> {
    return await this.roleRepository.find();
  }

  /**
   * 获取带有权限的角色信息
   */
  async getPermRoleInfo(rid: number) {
    const { name } = await this.roleRepository.findOne({
      where: { id: rid },
    });
    const permRoleList = await this.rolePermRepository.find({
      where: { roleId: rid },
    });
    if (permRoleList) {
      const permissionIds = permRoleList.map((item) => item.permId);
      return {
        name,
        permissionIds,
      };
    }
    return { name, permissionIds: [] };
  }

  /**
   * 获取权限列表
   */
  async permInfoList(): Promise<SysPerm[]> {
    return await this.permRepository.find();
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
  async add(param: CreateRoleDto): Promise<void> {
    const { name, remark, permissionIds } = param;
    const existname = await this.roleRepository.findOne({
      where: { name },
    });
    if (existname) {
      throw new ApiException(10006);
    }
    const role = await this.roleRepository.insert({
      name,
      remark,
    });
    const { identifiers } = role;
    const roleId = parseInt(identifiers[0].id);
    if (permissionIds && permissionIds.length > 0) {
      const insertPerm = permissionIds.map((e) => {
        return {
          permId: e,
          roleId,
        };
      });
      await this.entityManager.transaction(async (manager) => {
        await manager.insert(SysRolePerm, insertPerm);
      });
    }
  }

  /**
   * 更新角色信息
   */
  async update(param: UpdateRoleDto): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysRole, param.id, {
        name: param.name,
        remark: param.remark,
      });

      // 先删除原来的角色关系
      await manager.delete(SysRolePerm, { roleId: param.id });
      const insertRoles = param.permissionIds.map((e) => {
        return {
          permId: e,
          roleId: param.id,
        };
      });

      // 重新分配权限
      await manager.insert(SysRolePerm, insertRoles);
    });
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
        userId: id,
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
