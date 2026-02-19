import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from '../types/common.types';
import { REDIS_CLIENT_TOKEN } from './redis.constants';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
  ],
  providers: [
    {
      inject: [ConfigService],
      provide: REDIS_CLIENT_TOKEN,
      useFactory: (config: ConfigService<EnvConfig>): Redis =>
        new Redis({
          host: config.getOrThrow('REDIS_HOST'),
          port: config.getOrThrow('REDIS_PORT'),
          username: config.getOrThrow('REDIS_USER'),
          password: config.getOrThrow('REDIS_PASSWORD'),
        }),
    },
    RedisService,
  ],
  exports: [RedisService, REDIS_CLIENT_TOKEN],
})
export class RedisModule {}
