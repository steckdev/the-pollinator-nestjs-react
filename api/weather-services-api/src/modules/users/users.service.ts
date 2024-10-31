import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}
  public async create(createUserDto: CreateUserDto): Promise<UserDto> {
    if (!createUserDto || !createUserDto.zip || !createUserDto.name) {
      throw new Error('Invalid user data');
    }

    const user = await this.userRepository.create({ ...createUserDto });
    if (user) {
      return buildUserDto(user);
    }
    throw new Error('Unable to create user');
  }

  public async findOneById(id: string): Promise<UserDto | null> {
    if (!id) {
      throw new Error('Invalid user id');
    }
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      return buildUserDto(user);
    }

    return null;
  }
}
function buildUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    zip: user.zip,
    name: user.name,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    archived: user.archived,
  };
}
