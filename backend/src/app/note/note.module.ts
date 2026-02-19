import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { NoteProviders } from './note.providers';
import { DbModule } from 'src/common/db/db.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [DbModule, RedisModule],
  controllers: [NoteController],
  providers: [NoteService, ...NoteProviders],
})
export class NoteModule {}
