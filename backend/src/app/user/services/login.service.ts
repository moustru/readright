import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from '../dto/login.dto';
import { User } from '../models/user.model';
import { verify } from 'argon2';
import { UserService } from './user.service';
import type { Response } from 'express';

@Injectable()
export class LoginService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
    private readonly userService: UserService,
  ) {}

  async login(res: Response, { name, password }: LoginUserDto) {
    const relatedUser = await this.userRepository.findOne({
      where: { name },
      raw: true,
    });

    if (!relatedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidPassword = await verify(relatedUser.password, password);

    if (!isValidPassword) {
      throw new NotFoundException('Пользователь не найден 2');
    }

    return this.userService.auth(res, name);
  }

  logout(res: Response) {
    this.userService.setCookie(res, 'refreshToken', new Date(0));
  }
}
