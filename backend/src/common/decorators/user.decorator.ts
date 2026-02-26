import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/app/user/models/user.model';
import type { Request } from 'express';

export const UserInfo = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const user = request.user;

    return data ? (user![data] as keyof User) : user;
  },
);
