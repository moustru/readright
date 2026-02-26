import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dto';
import { type Request, type Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/common/decorators/auth.decorator';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { User } from './models/user.model';

@ApiTags('Auth')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Авторизация',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginUserDto,
  ) {
    return await this.userService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Регистрация',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterUserDto,
  ) {
    return await this.userService.register(res, dto);
  }

  @ApiOperation({
    summary: 'Рефреш токена',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.userService.refresh(req, res);
  }

  @ApiOperation({
    summary: 'Выход из аккаунта',
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.userService.logout(res);
  }

  @WithAuth()
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@UserInfo() user: User) {
    return user;
  }
}
