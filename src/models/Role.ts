import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';

@Table({
  tableName: 'roles',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Role extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  })
  nombre!: string;

  @Column({
    type: DataType.TEXT
  })
  descripcion?: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  created_at!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @HasMany(() => require('./Usuario').default)
  usuarios?: any[];
} 