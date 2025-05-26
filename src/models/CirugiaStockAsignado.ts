import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Cirugia from './Cirugia';
import Item from './Item';
import EntidadSuministradora from './EntidadSuministradora';
import Usuario from './Usuario';

@Table({
  tableName: 'cirugia_stock_asignado',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class CirugiaStockAsignado extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => Cirugia)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  cirugia_id!: number;

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
    allowNull: false,
    defaultValue: 1
  })
  cantidad_asignada!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  es_adicional!: boolean;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_asignacion!: Date;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  asignado_por_id!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => Cirugia)
  cirugia!: Cirugia;

  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => EntidadSuministradora)
  entidad_suministradora!: EntidadSuministradora;

  @BelongsTo(() => Usuario, 'asignado_por_id')
  asignado_por!: Usuario;
} 