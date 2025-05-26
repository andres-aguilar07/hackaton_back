import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { MetodoEsterilizacion } from './types';
import Item from './Item';
import Cirugia from './Cirugia';
import EntidadSuministradora from './EntidadSuministradora';
import Usuario from './Usuario';

@Table({
  tableName: 'esterilizaciones',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Esterilizacion extends Model {
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

  @ForeignKey(() => Cirugia)
  @Column({
    type: DataType.INTEGER
  })
  cirugia_origen_id?: number;

  @ForeignKey(() => EntidadSuministradora)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  entidad_suministradora_id!: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_esterilizacion!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(MetodoEsterilizacion)),
    defaultValue: MetodoEsterilizacion.OTRO
  })
  metodo_esterilizacion!: MetodoEsterilizacion;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  responsable_id!: number;

  @Column({
    type: DataType.STRING(50)
  })
  lote_esterilizacion?: string;

  @Column({
    type: DataType.DECIMAL(5, 2)
  })
  temperatura?: number;

  @Column({
    type: DataType.INTEGER
  })
  tiempo_minutos?: number;

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
  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => Cirugia, 'cirugia_origen_id')
  cirugia_origen?: Cirugia;

  @BelongsTo(() => EntidadSuministradora)
  entidad_suministradora!: EntidadSuministradora;

  @BelongsTo(() => Usuario, 'responsable_id')
  responsable!: Usuario;
} 