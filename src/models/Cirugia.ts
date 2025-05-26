import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { EstadoCirugia, Prioridad } from './types';
import Paciente from './Paciente';
import TipoCirugia from './TipoCirugia';
import Quirofano from './Quirofano';
import Medico from './Medico';
import Usuario from './Usuario';
import CirugiaPersonal from './CirugiaPersonal';
import CirugiaStockAsignado from './CirugiaStockAsignado';
import ConteoInstrumentacion from './ConteoInstrumentacion';
import EntregaStock from './EntregaStock';
import Esterilizacion from './Esterilizacion';
import Incidente from './Incidente';
import SolicitudCirugia from './SolicitudCirugia';

@Table({
  tableName: 'cirugias',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Cirugia extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => Paciente)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  paciente_id!: number;

  @ForeignKey(() => TipoCirugia)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  tipo_cirugia_id!: number;

  @ForeignKey(() => Quirofano)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  quirofano_id!: number;

  @ForeignKey(() => Medico)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  cirujano_principal_id!: number;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER
  })
  instrumentador_id?: number;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  fecha_programada!: Date;

  @Column({
    type: DataType.DATE
  })
  fecha_inicio?: Date;

  @Column({
    type: DataType.DATE
  })
  fecha_fin?: Date;

  @Column({
    type: DataType.ENUM(...Object.values(EstadoCirugia)),
    defaultValue: EstadoCirugia.PROGRAMADA
  })
  estado!: EstadoCirugia;

  @Column({
    type: DataType.ENUM(...Object.values(Prioridad)),
    defaultValue: Prioridad.MEDIA
  })
  prioridad!: Prioridad;

  @Column({
    type: DataType.TEXT
  })
  observaciones_previas?: string;

  @Column({
    type: DataType.TEXT
  })
  observaciones_finales?: string;

  @Column({
    type: DataType.TEXT
  })
  diagnostico_preoperatorio?: string;

  @Column({
    type: DataType.TEXT
  })
  diagnostico_postoperatorio?: string;

  @Column({
    type: DataType.INTEGER
  })
  duracion_real_minutos?: number;

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
  @BelongsTo(() => Paciente)
  paciente!: Paciente;

  @BelongsTo(() => TipoCirugia)
  tipo_cirugia!: TipoCirugia;

  @BelongsTo(() => Quirofano)
  quirofano!: Quirofano;

  @BelongsTo(() => Medico, 'cirujano_principal_id')
  cirujano_principal!: Medico;

  @BelongsTo(() => Usuario, 'instrumentador_id')
  instrumentador?: Usuario;

  @HasMany(() => CirugiaPersonal)
  personal?: CirugiaPersonal[];

  @HasMany(() => CirugiaStockAsignado)
  stock_asignado?: CirugiaStockAsignado[];

  @HasMany(() => ConteoInstrumentacion)
  conteos?: ConteoInstrumentacion[];

  @HasMany(() => EntregaStock)
  entregas?: EntregaStock[];

  @HasMany(() => SolicitudCirugia)
  solicitudes?: SolicitudCirugia[];

  @HasMany(() => Esterilizacion, 'cirugia_origen_id')
  esterilizaciones?: Esterilizacion[];

  @HasMany(() => Incidente)
  incidentes?: Incidente[];
} 