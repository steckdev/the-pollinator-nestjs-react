import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockDeep } from 'jest-mock-extended';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let userService: UsersService;
  const mockUserRepository: any = {
    ...mockDeep<User>(),
    ...{ findOne: jest.fn(), create: jest.fn() },
  };

  const testUserId = 'userId123';
  const testUser: User = mock<User>();

  const mockCreateUserDto = mock<CreateUserDto>();

  const testUserDto: UserDto = {
    id: testUser.id,
    name: testUser.name,
    email: testUser.email,
    zip: testUser.zip,
    createdAt: testUser.created_at,
    updatedAt: testUser.updated_at,
    archived: testUser.archived,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    describe('create a user response', () => {
      beforeEach(() => {
        mockUserRepository.create.mockResolvedValue(testUser);
      });

      it('should return the user and companies when a user exists with the given id', async () => {
        const result = await userService.create(mockCreateUserDto);

        expect(result).toEqual(testUserDto);
        expect(mockUserRepository.create).toHaveBeenCalledWith({
          ...mockCreateUserDto,
        });
      });
    });

    it('should throw an error when an invalid create user dto is provided', async () => {
      await expect(userService.create(undefined)).rejects.toThrow(
        'Invalid user data',
      );
    });

    it('should throw an error when failure to create user in user repository', async () => {
      mockUserRepository.create.mockResolvedValue(null);
      await expect(userService.create(mockCreateUserDto)).rejects.toThrow(
        'Unable to create user',
      );
    });
  });

  describe('findOneById', () => {
    describe('given a user response', () => {
      beforeEach(() => {
        mockUserRepository.findOne.mockResolvedValue(testUser);
      });

      it('should return the user and companies when a user exists with the given id', async () => {
        const result = await userService.findOneById(testUserId);

        expect(result).toEqual(testUserDto);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          where: { id: testUserId },
        });
      });
    });

    it('should throw an error when an invalid user id is provided', async () => {
      await expect(userService.findOneById(undefined)).rejects.toThrow(
        'Invalid user id',
      );
    });
  });
});
