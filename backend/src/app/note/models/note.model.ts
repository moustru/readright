import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/app/user/models/user.model';

@Table({
  timestamps: false,
})
export class Note extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => User)
  @IsUUID(4)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  author: string;

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

  @Column({
    allowNull: false,
  })
  title: string;

  @Column
  content: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  views: number;
}
