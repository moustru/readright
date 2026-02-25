import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

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

  @Column({
    allowNull: false,
  })
  // @IsUUID(4)
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
