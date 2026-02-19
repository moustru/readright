import { Module } from '@nestjs/common';
import { DbProviders } from './db.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development', '.env'] }),
  ],
  providers: [...DbProviders],
  exports: [...DbProviders],
})
export class DbModule {}
