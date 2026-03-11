import { Module } from '@nestjs/common';
import { NoteModule } from './note/note.module';
import { DbModule } from '../common/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development.local', '.env'] }),
    NoteModule,
    DbModule,
    UserModule,
  ],
})
export class AppModule {}
