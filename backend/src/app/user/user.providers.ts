import { User } from './models/user.model';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
