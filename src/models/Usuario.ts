import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';
import Role from './Role';

import Notificacion from './Notificacion';
import SesionUsuario from './SesionUsuario';
import CirugiaStockAsignado from './CirugiaStockAsignado';
import CirugiaPersonal from './CirugiaPersonal';
import ConteoInstrumentacion from './ConteoInstrumentacion';
import EntidadSuministradora from './EntidadSuministradora';
import EntregaStock from './EntregaStock';
import Esterilizacion from './Esterilizacion';
import Incidente from './Incidente';
import Medico from './Medico';
import SolicitudCirugia from './SolicitudCirugia';

@Table({
  tableName: 'usuarios',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Usuario extends Model {
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
    type: DataType.STRING(100),
    allowNull: false
  })
  apellido!: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  password_hash!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true
  })
  cedula!: string;

  @Column({
    type: DataType.STRING(20)
  })
  telefono?: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  rol_id!: number;

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
    defaultValue: DataType.NOW
  })
  updated_at!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => Role)
  rol!: Role;

  @HasOne(() => Medico)
  medico?: Medico;

  @HasMany(() => EntidadSuministradora, 'responsable_id')
  entidades_suministradoras?: EntidadSuministradora[];

  @HasMany(() => CirugiaPersonal, 'medico_id')
  cirugias_personal?: CirugiaPersonal[];

  @HasMany(() => CirugiaStockAsignado, 'asignado_por_id')
  stock_asignado?: CirugiaStockAsignado[];

  @HasMany(() => ConteoInstrumentacion, 'realizado_por_id')
  conteos_realizados?: ConteoInstrumentacion[];

  @HasMany(() => EntregaStock, 'entregado_por_id')
  entregas_realizadas?: EntregaStock[];

  @HasMany(() => EntregaStock, 'recibido_por_id')
  entregas_recibidas?: EntregaStock[];

  @HasMany(() => SolicitudCirugia, 'solicitado_por_id')
  solicitudes_realizadas?: SolicitudCirugia[];

  @HasMany(() => Esterilizacion, 'responsable_id')
  esterilizaciones_realizadas?: Esterilizacion[];

  @HasMany(() => Incidente, 'reportado_por_id')
  incidentes_reportados?: Incidente[];

  @HasMany(() => Notificacion)
  notificaciones?: Notificacion[];

  @HasMany(() => SesionUsuario)
  sesiones?: SesionUsuario[];
} 