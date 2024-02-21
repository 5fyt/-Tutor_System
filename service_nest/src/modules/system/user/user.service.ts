import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { camelCase, isEmpty } from 'lodash';
import { ApiException } from 'src/common/exceptions/api.exception';
import SysUser from 'src/entities/user.entity';
import SysUserRole from 'src/entities/user-role.entity';
import { UtilService } from 'src/shared/services/util.service';
import { EntityManager, In, Repository } from 'typeorm';
import { RedisService } from 'src/shared/services/redis.service';
import { SysRoleService } from 'src/modules/system/role/role.service';
import { AccountInfo, PageSearchUserInfo } from './user.class';
import {
  CreateUserDto,
  PageSearchUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UpdateUserInfoDto,
} from './user.dto';

@Injectable()
export class SysUserService {
  constructor(
    @InjectRepository(SysUser) private userRepository: Repository<SysUser>,
    private redisService: RedisService,
    private roleService: SysRoleService,
    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,
    @InjectEntityManager() private entityManager: EntityManager,
    private util: UtilService,
  ) {}

  /**
   * 根据用户名查找已经启用的用户
   */
  async findUserByUserName(username: string): Promise<SysUser | undefined> {
    return await this.userRepository.findOne({
      where: { username: username },
    });
  }

  /**
   * 获取用户信息
   * @param uid user id
   * @param ip login ip
   */
  async getAccountInfo(uid: number, ip?: string): Promise<AccountInfo> {
    const user: SysUser = await this.userRepository.findOne({
      where: { id: uid },
    });
    console.log(user);
    const roles: number[] = await this.roleService.getRoleIdByUser(uid);
    const roleNamePromises: Promise<string>[] = roles.map(async (role) => {
      const { roleInfo } = await this.roleService.info(role);
      return roleInfo.name;
    });

    const roleName: string[] = await Promise.all(roleNamePromises);

    if (isEmpty(user)) {
      throw new ApiException(10017);
    }
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      headImg: user.headImg,
      role: roleName,
      loginIp: ip,
    };
  }

  /**
   * 更新个人信息
   */
  async updatePersonInfo(uid: number, info: UpdateUserInfoDto): Promise<void> {
    await this.userRepository.update(uid, info);
  }

  /**
   * 更改管理员密码
   */
  async updatePassword(uid: number, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: uid } });
    if (isEmpty(user)) {
      throw new ApiException(10017);
    }
    const comparePassword = this.util.md5(`${dto.originPassword}${user.psalt}`);
    // 原密码不一致，不允许更改
    if (user.password !== comparePassword) {
      throw new ApiException(10011);
    }
    const password = this.util.md5(`${dto.newPassword}${user.psalt}`);
    await this.userRepository.update({ id: uid }, { password });
    await this.upgradePasswordV(user.id);
  }

  /**
   * 增加系统用户，如果返回false则表示已存在该用户
   * @param param Object 对应SysUser实体类
   */
  async add(param: CreateUserDto): Promise<void> {
    // const insertData: any = { ...CreateUserDto };
    const exists = await this.userRepository.findOne({
      where: { username: param.username },
    });
    if (!isEmpty(exists)) {
      throw new ApiException(10001);
    }
    // 所有用户初始密码为123456
    await this.entityManager.transaction(async (manager) => {
      const salt = this.util.generateRandomValue(32);
      const password = this.util.md5(`${'123456'}${salt}`);

      const u = manager.create(SysUser, {
        username: param.username,
        password,
        name: param.name,
        email: param.email,
        phone: param.phone,
        psalt: salt,
      });
      await manager.save(u);
      const result = await manager.save(u);
      const { roles } = param;
      const insertRoles = roles.map((e) => {
        return {
          roleId: e,
          userId: result.id,
        };
      });
      // 分配角色
      await manager.insert(SysUserRole, insertRoles);
    });
  }

  /**
   * 更新用户信息
   */
  async update(param: UpdateUserDto): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(SysUser, param.id, {
        username: param.username,
        name: param.name,
        email: param.email,
        phone: param.phone,
      });
      // 先删除原来的角色关系
      await manager.delete(SysUserRole, { userId: param.id });
      const insertRoles = param.roles.map((e) => {
        return {
          roleId: e,
          userId: param.id,
        };
      });
      // 重新分配角色
      await manager.insert(SysUserRole, insertRoles);
    });
  }

  /**
   * 查找用户信息
   * @param id 用户id
   */
  async info(id: number): Promise<SysUser & { roles: number[] }> {
    const user: any = await this.userRepository.findOne({ where: { id } });
    if (isEmpty(user)) {
      throw new ApiException(10017);
    }
    delete user.password;
    return user;
  }

  /**
   * 查找列表里的信息
   */
  async infoList(ids: number[]): Promise<SysUser[]> {
    const users = await this.userRepository.findBy({ id: In(ids) });
    return users;
  }

  /**
   * 根据ID列表删除用户
   */
  async delete(userIds: number[]): Promise<void | never> {
    await this.userRepository.delete(userIds);
    await this.userRoleRepository.delete({ userId: In(userIds) });
  }

  //分页查询用户
  async page(
    uid: number,
    params: PageSearchUserDto,
  ): Promise<[PageSearchUserInfo[], number]> {
    const { limit, page, name, username, phone } = params;
    const qb = this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect(
        'sys_user_role',
        'user_role',
        'user_role.user_id = user.id',
      )
      .innerJoinAndSelect('sys_role', 'role', 'role.id = user_role.role_id')
      .select(['user.id,GROUP_CONCAT(role.name) as roleNames', 'user.*'])
      .where('user.id NOT IN (:...ids)', { ids: [uid] }) //除去登录账号那项
      .andWhere('user.name LIKE :name', { name: `%${name}%` })
      .andWhere('user.username LIKE :username', { username: `%${username}%` })
      .andWhere('user.phone LIKE :phone', { phone: `%${phone}%` })
      .orderBy('user.updated_at', 'DESC')
      .groupBy('user.id')
      .offset((page - 1) * limit)
      .limit(limit);
    const [_, total] = await qb.getManyAndCount();
    const list = await qb.getRawMany();
    const dealResult: PageSearchUserInfo[] = list.map((n) => {
      const convertData = Object.entries<[string, any]>(n).map(
        ([key, value]) => [camelCase(key), value],
      );
      return {
        ...Object.fromEntries(convertData),
        roleNames: n.roleNames.split(','),
      };
    });
    return [dealResult, total];
  }

  /**
   * 禁用用户
   */
  async forbidden(uid: number): Promise<void> {
    await this.redisService.getRedis().del(`admin:passwordVersion:${uid}`);
    await this.redisService.getRedis().del(`admin:token:${uid}`);
    await this.redisService.getRedis().del(`admin:perms:${uid}`);
  }

  /**
   * 禁用多个用户
   */
  async multiForbidden(uids: number[]): Promise<void> {
    if (uids) {
      const pvs: string[] = [];
      const ts: string[] = [];
      const ps: string[] = [];
      uids.forEach((e) => {
        pvs.push(`admin:passwordVersion:${e}`);
        ts.push(`admin:token:${e}`);
        ps.push(`admin:perms:${e}`);
      });
      await this.redisService.getRedis().del(pvs);
      await this.redisService.getRedis().del(ts);
      await this.redisService.getRedis().del(ps);
    }
  }

  /**
   * 升级用户版本密码
   */
  async upgradePasswordV(id: number): Promise<void> {
    // admin:passwordVersion:${param.id}
    const v = await this.redisService
      .getRedis()
      .get(`admin:passwordVersion:${id}`);
    if (!isEmpty(v)) {
      await this.redisService
        .getRedis()
        .set(`admin:passwordVersion:${id}`, parseInt(v) + 1);
    }
  }
}
