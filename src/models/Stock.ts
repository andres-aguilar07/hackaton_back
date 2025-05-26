import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Item from './Item';
import EntidadSuministradora from './EntidadSuministradora';

@Table({
  tableName: 'stock',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Stock extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  item_id!: number;

  @ForeignKey(() => EntidadSuministradora)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  entidad_suministradora_id!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  cantidad_disponible!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  cantidad_en_uso!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1
  })
  cantidad_minima!: number;

  @Column({
    type: DataType.STRING(50)
  })
  lote?: string;

  @Column({
    type: DataType.DATEONLY
  })
  fecha_vencimiento?: Date;

  @Column({
    type: DataType.STRING(100)
  })
  ubicacion_almacen?: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  updated_at!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => EntidadSuministradora)
  entidad_suministradora!: EntidadSuministradora;
} 