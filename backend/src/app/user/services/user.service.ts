import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../models/user.model';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt.interface';
import { type Response } from 'express';
import { isDev } from 'src/utils/is-dev.util';
import { USER_REPOSITORY } from '../user.constants';

@Injectable()
export class UserService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  private readonly COOKIE_DOMAIN: string;

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );

    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  private _generateTokens(user_id: string) {
    const payload: JwtPayload = {
      user_id,
    };

    const accessTtl = Number(this.JWT_ACCESS_TOKEN_TTL);
    const refreshTtl = Number(this.JWT_REFRESH_TOKEN_TTL);

    if (isNaN(accessTtl) || isNaN(refreshTtl)) {
      throw new InternalServerErrorException('Invalid JWT TTL values');
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTtl,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTtl,
    });

    return { accessToken, refreshToken };
  }

  async validate(user_id: string) {
    const relatedUser = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!relatedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return relatedUser;
  }

  auth(res: Response, user_id: string) {
    const { accessToken, refreshToken } = this._generateTokens(user_id);

    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + Number(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return { accessToken };
  }

  setCookie(res: Response, token: string, expires: Date) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      domain: isDev(this.configService) ? undefined : this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'lax' : 'none',
      path: '/',
    });
  }
}
