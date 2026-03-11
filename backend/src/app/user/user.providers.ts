import { User } from './models/user.model';
import { USER_REPOSITORY } from './user.constants';

export const UserProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
