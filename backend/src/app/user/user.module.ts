import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserProviders } from './user.providers';
import { DbModule } from 'src/common/db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { RefreshService } from './services/refresh.service';

@Module({
  imports: [
    DbModule,
    PassportModule,
    ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    LoginService,
    RegisterService,
    RefreshService,
    JwtStrategy,
    ...UserProviders,
  ],
  exports: [
    UserService,
    LoginService,
    RegisterService,
    RefreshService,
    ...UserProviders,
  ],
})
export class UserModule {}
