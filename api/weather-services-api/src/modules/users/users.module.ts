import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { userRepository } from './users.repository';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...userRepository],
})
export class UsersModule {}
