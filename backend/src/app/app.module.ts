import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { DbModule } from '../common/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
    NoteModule,
    RedisModule,
    DbModule,
  ],
})
export class AppModule {}
