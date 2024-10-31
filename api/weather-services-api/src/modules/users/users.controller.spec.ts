import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mock } from 'jest-mock-extended';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUserService = mock<UsersService>();

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
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    describe('given a valid create user dto', () => {
      beforeEach(() => {
        mockUserService.create.mockResolvedValue(testUserDto);
      });
      it('should create a user', async () => {
        const result = await controller.create(mockCreateUserDto);

        expect(result).toEqual(testUserDto);
      });
    });
    describe('given an invalid create user dto', () => {
      beforeEach(() => {
        mockUserService.create.mockRejectedValue(new Error());
      });
      it('should throw an error', async () => {
        await expect(controller.create(mockCreateUserDto)).rejects.toThrow();
      });
    });
  });

  describe('findOne', () => {
    describe('given a valid user id', () => {
      beforeEach(() => {
        mockUserService.findOneById.mockResolvedValue(testUserDto);
      });
      it('should return a user', async () => {
        const result = await controller.findOne(testUser.id);

        expect(result).toEqual(testUserDto);
      });
    });
    describe('given an invalid user id', () => {
      beforeEach(() => {
        mockUserService.findOneById.mockResolvedValue(null);
      });
      it('should throw an error', async () => {
        await expect(controller.findOne(testUser.id)).rejects.toThrow();
      });
    });
  });
});
