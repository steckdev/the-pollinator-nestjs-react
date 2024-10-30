import { User } from './entities/user.entity';

export const userRepository = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
