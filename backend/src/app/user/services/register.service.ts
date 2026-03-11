import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../dto/register.dto';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { hash } from 'argon2';
import type { Response } from 'express';
import { USER_REPOSITORY } from '../user.constants';

@Injectable()
export class RegisterService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly userService: UserService,
  ) {}

  async register(res: Response, { name, password }: RegisterUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { name },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким именем уже существует');
    }

    await this.userRepository.create({
      name,
      password: (await hash(password)).trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const userInfo = await this.userRepository.findOne({
      where: { name },
      raw: true,
    });

    if (!userInfo) {
      throw new UnauthorizedException('Ошибка создания пользователя');
    }

    return this.userService.auth(res, userInfo.user_id);
  }
}
