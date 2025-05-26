import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Prioridad, EstadoSolicitud } from './types';
import Cirugia from './Cirugia';
import Item from './Item';
import EntidadSuministradora from './EntidadSuministradora';
import Usuario from './Usuario';

@Table({
  tableName: 'solicitudes_cirugia',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class SolicitudCirugia extends Model {
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
  cantidad_solicitada!: number;

  @Column({
    type: DataType.ENUM(...Object.values(Prioridad)),
    defaultValue: Prioridad.MEDIA
  })
  prioridad!: Prioridad;

  @Column({
    type: DataType.ENUM(...Object.values(EstadoSolicitud)),
    defaultValue: EstadoSolicitud.PENDIENTE
  })
  estado!: EstadoSolicitud;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_solicitud!: Date;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  solicitado_por_id!: number;

  @Column({
    type: DataType.TEXT
  })
  observaciones?: string;

  @Column({
    type: DataType.DATE
  })
  fecha_entrega?: Date;

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

  @BelongsTo(() => Usuario, 'solicitado_por_id')
  solicitado_por!: Usuario;
} 