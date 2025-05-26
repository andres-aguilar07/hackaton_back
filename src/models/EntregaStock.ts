import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Cirugia from './Cirugia';
import Item from './Item';
import EntidadSuministradora from './EntidadSuministradora';
import Usuario from './Usuario';

@Table({
  tableName: 'entregas_stock',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class EntregaStock extends Model {
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
    allowNull: false
  })
  cantidad_entregada!: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_entrega!: Date;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  entregado_por_id!: number;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  recibido_por_id!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  es_urgente!: boolean;

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
  @BelongsTo(() => Cirugia)
  cirugia!: Cirugia;

  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => EntidadSuministradora)
  entidad_suministradora!: EntidadSuministradora;

  @BelongsTo(() => Usuario, 'entregado_por_id')
  entregado_por!: Usuario;

  @BelongsTo(() => Usuario, 'recibido_por_id')
  recibido_por!: Usuario;
} 