import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { NoteProviders } from './note.providers';
import { DbModule } from 'src/common/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [NoteController],
  providers: [NoteService, ...NoteProviders],
})
export class NoteModule {}
