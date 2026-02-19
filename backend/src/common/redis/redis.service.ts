import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT_TOKEN } from './redis.constants';
import Redis from 'ioredis';
import { isDefined } from 'class-validator';

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_CLIENT_TOKEN) private readonly redis: Redis,
  ) {}

  public async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    return value ? (JSON.parse(value) as T) : null;
  }

  public async getAll<T = unknown>(
    keyPattern: string,
  ): Promise<Record<string, T>> {
    const keys = await this.redis.keys(keyPattern);

    if (!keys.length) return {};

    const values = await this.redis.mget(keys);

    return keys.reduce<Record<string, T>>((acc, key, index) => {
      const raw = values[index];

      if (!isDefined(raw)) return acc;

      acc[key] = JSON.parse(raw) as T;

      return acc;
    }, {});
  }

  public async set<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
    const stringValue = JSON.stringify(value);

    if (ttlSeconds) {
      await this.redis.set(key, stringValue, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, stringValue);
    }
  }

  public async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public async flush(): Promise<void> {
    await this.redis.flushdb();
  }
}
