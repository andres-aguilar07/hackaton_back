import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { TipoItem } from './types';
import Item from './Item';

@Table({
  tableName: 'categorias_items',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class CategoriaItem extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true
  })
  nombre!: string;

  @Column({
    type: DataType.ENUM(...Object.values(TipoItem)),
    allowNull: false
  })
  tipo!: TipoItem;

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
  @HasMany(() => Item)
  items?: Item[];
} 