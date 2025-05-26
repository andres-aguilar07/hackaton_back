import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EstadoConteo } from './types';
import ConteoInstrumentacion from './ConteoInstrumentacion';
import Item from './Item';

@Table({
  tableName: 'detalle_conteos',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class DetalleConteo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => ConteoInstrumentacion)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  conteo_id!: number;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  item_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  cantidad_esperada!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  cantidad_contada!: number;

  @Column({
    type: DataType.ENUM(...Object.values(EstadoConteo)),
    allowNull: false,
    defaultValue: EstadoConteo.CORRECTO
  })
  estado!: EstadoConteo;

  @Column({
    type: DataType.TEXT
  })
  observaciones?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => ConteoInstrumentacion)
  conteo!: ConteoInstrumentacion;

  @BelongsTo(() => Item)
  item!: Item;
} 