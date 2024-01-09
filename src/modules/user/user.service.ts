import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiException } from 'src/common/exceptions/api.exception';
// import { CreateUserDto, AddUserRoleDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findOneByUserName(userName: string) {
    const res = await this.userRepository.findOne({
      relations: ['role'],
      where: { userName },
    });
    if (!res) {
      throw new ApiException(10017);
    }
    return res;
  }
}
