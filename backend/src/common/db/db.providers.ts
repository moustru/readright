import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Note } from 'src/app/note/models/note.model';
import { User } from 'src/app/user/models/user.model';
import { EnvConfig } from 'src/common/types/common.types';
// import { User } from 'src/app/user/models/user.model';

export const DbProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService<EnvConfig>) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: config.getOrThrow('DB_HOST'),
        port: config.getOrThrow('DB_PORT'),
        username: config.getOrThrow('POSTGRES_USER'),
        password: config.getOrThrow('POSTGRES_PASSWORD'),
        database: config.getOrThrow('POSTGRES_DB'),
      });

      sequelize.addModels([Note, User]);

      await sequelize.query('DISCARD ALL;');
      await sequelize.sync();

      return sequelize;
    },
  },
];
