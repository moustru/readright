import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/app/user/models/user.model';

@Table({
  tableName: 'notes',
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
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  user_id: string;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
  })
  user: User;

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

  get author() {
    return this.user.name;
  }
}
