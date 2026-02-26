import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './models/user.model';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';
import { type Request, type Response } from 'express';
import { isDev } from 'src/utils/is-dev.util';

@Injectable()
export class UserService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  private readonly COOKIE_DOMAIN: string;

  constructor(
    @Inject('USER_REPOSITORY') private userRepository: typeof User,
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

  async login(res: Response, { name, password }: LoginUserDto) {
    const relatedUser = await this.userRepository.findOne({
      where: { name },
      raw: true,
    });

    if (!relatedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    console.log({ relatedUser, password });

    const isValidPassword = await verify(relatedUser.password, password).catch(
      console.log,
    );

    if (!isValidPassword) {
      throw new NotFoundException('Пользователь не найден 2');
    }

    return this._auth(res, name);
  }

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

      return this._auth(res, payload.name);
    }
  }

  async register(res: Response, { name, password }: RegisterUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { name } });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким именем уже существует');
    }

    await this.userRepository.create({
      name,
      password: (await hash(password)).trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return this._auth(res, name);
  }

  logout(res: Response) {
    this._setCookie(res, 'refreshToken', new Date(0));
  }

  private _generateTokens(name: string) {
    const payload: JwtPayload = {
      name,
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

  async validate(name: string) {
    const relatedUser = await this.userRepository.findOne({ where: { name } });

    if (!relatedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return relatedUser;
  }

  private _auth(res: Response, name: string) {
    const { accessToken, refreshToken } = this._generateTokens(name);

    this._setCookie(
      res,
      refreshToken,
      new Date(Date.now() + Number(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return { accessToken };
  }

  private _setCookie(res: Response, token: string, expires: Date) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
