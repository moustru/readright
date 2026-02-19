import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { DbModule } from '../common/db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
    NoteModule,
    DbModule,
  ],
})
export class AppModule {}
