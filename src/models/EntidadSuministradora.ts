import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { TipoEntidad } from './types';
import Usuario from './Usuario';
import Notificacion from './Notificacion';
import CirugiaStockAsignado from './CirugiaStockAsignado';
import EntregaStock from './EntregaStock';
import Esterilizacion from './Esterilizacion';
import SolicitudCirugia from './SolicitudCirugia';
import Stock from './Stock';

@Table({
  tableName: 'entidades_suministradoras',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class EntidadSuministradora extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  nombre!: string;

  @Column({
    type: DataType.ENUM(...Object.values(TipoEntidad)),
    allowNull: false
  })
  tipo!: TipoEntidad;

  @Column({
    type: DataType.STRING(200)
  })
  ubicacion?: string;

  @Column({
    type: DataType.STRING(20)
  })
  telefono?: string;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER
  })
  responsable_id?: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  activo!: boolean;

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
  @BelongsTo(() => Usuario, 'responsable_id')
  responsable?: Usuario;

  @HasMany(() => Stock)
  stocks?: Stock[];

  @HasMany(() => CirugiaStockAsignado)
  stock_asignado_cirugias?: CirugiaStockAsignado[];

  @HasMany(() => EntregaStock)
  entregas_stock?: EntregaStock[];

  @HasMany(() => SolicitudCirugia)
  solicitudes_cirugia?: SolicitudCirugia[];

  @HasMany(() => Esterilizacion)
  esterilizaciones?: Esterilizacion[];

  @HasMany(() => Notificacion)
  notificaciones?: Notificacion[];
} 