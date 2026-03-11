import { IsUUID } from 'class-validator';
import { UUIDV4 } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Note } from 'src/app/note/models/note.model';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  @IsUUID(4)
  user_id: string;

  @Column({
    allowNull: false,
    type: DataType.CHAR(255),
    unique: true,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare created_at: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updated_at: string;

  @HasMany(() => Note, {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
  })
  notes: Note[];
}
