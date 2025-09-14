import { Controller, Get, Post, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Create user from dto' })
  @ApiResponse({ status: 200, description: 'Returns the created user.', type: () => UserDto })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> { return this.usersService.create(createUserDto); }
  @ApiOperation({ summary: 'Get user by user id' })
  @ApiResponse({ status: 200, description: 'Returns the user from matching id.', type: () => UserDto })
  @ApiResponse({ status: 404, description: 'User not found', type: () => Error })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto | HttpStatus> {
    const response = await this.usersService.findOneById(id);
    if (response) return response;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}

