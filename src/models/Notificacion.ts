import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { TipoNotificacion, Prioridad } from './types';
import Usuario from './Usuario';
import EntidadSuministradora from './EntidadSuministradora';

@Table({
  tableName: 'notificaciones',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Notificacion extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER
  })
  usuario_id?: number;

  @ForeignKey(() => EntidadSuministradora)
  @Column({
    type: DataType.INTEGER
  })
  entidad_suministradora_id?: number;

  @Column({
    type: DataType.ENUM(...Object.values(TipoNotificacion)),
    allowNull: false
  })
  tipo!: TipoNotificacion;

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  titulo!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  mensaje!: string;

  @Column({
    type: DataType.ENUM(...Object.values(Prioridad)),
    defaultValue: Prioridad.MEDIA
  })
  prioridad!: Prioridad;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  leida!: boolean;

  @Column({
    type: DataType.STRING(500)
  })
  url_accion?: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_creacion!: Date;

  @Column({
    type: DataType.DATE
  })
  fecha_lectura?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => Usuario)
  usuario?: Usuario;

  @BelongsTo(() => EntidadSuministradora)
  entidad_suministradora?: EntidadSuministradora;
} 