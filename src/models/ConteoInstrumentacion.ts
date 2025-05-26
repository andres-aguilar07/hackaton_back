import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { TipoConteo } from './types';
import Cirugia from './Cirugia';
import Usuario from './Usuario';

@Table({
  tableName: 'conteos_instrumentacion',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class ConteoInstrumentacion extends Model {
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

  @Column({
    type: DataType.ENUM(...Object.values(TipoConteo)),
    allowNull: false
  })
  tipo_conteo!: TipoConteo;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_conteo!: Date;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  realizado_por_id!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  confirmado!: boolean;

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

  @BelongsTo(() => Usuario, 'realizado_por_id')
  realizado_por!: Usuario;

  @HasMany(() => require('./DetalleConteo').default)
  detalles?: any[];
} 