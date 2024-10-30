import {
  Table,
  Column,
  Model,
  CreatedAt,
  DataType,
  UpdatedAt,
  BeforeValidate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table
export class User extends Model {
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  zip: string;

  @Column({
    type: DataType.STRING,
  })
  email?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  updated_at?: Date;

  @Column({
    type: DataType.DATE,
  })
  archived?: Date;

  @BeforeValidate
  static addPrefixToId(instance: User) {
    if (!instance.id) {
      instance.id = uuidv4();
    }
  }
}
