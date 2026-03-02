import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtPayload } from '../interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable()
export class RefreshService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Недействительный refresh-токен');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const relatedUser = await this.userRepository.findOne({
        where: { name: payload.name },
      });

      if (!relatedUser) {
        throw new NotFoundException('Пользователь не найден');
      }

      return this.userService.auth(res, payload.name);
    }
  }
}
