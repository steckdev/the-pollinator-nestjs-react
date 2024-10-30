import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { userRepository } from './users.repository';

@Module({
  providers: [UsersService, ...userRepository],
})
export class UsersModule {}
