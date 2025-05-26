import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { TipoIncidente, NivelComplejidad } from './types';
import Cirugia from './Cirugia';
import Usuario from './Usuario';

@Table({
  tableName: 'incidentes',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Incidente extends Model {
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
    type: DataType.ENUM(...Object.values(TipoIncidente)),
    allowNull: false
  })
  tipo_incidente!: TipoIncidente;

  @Column({
    type: DataType.ENUM(...Object.values(NivelComplejidad)),
    allowNull: false
  })
  severidad!: NivelComplejidad;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  descripcion!: string;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  reportado_por_id!: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_incidente!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  resuelto!: boolean;

  @Column({
    type: DataType.DATE
  })
  fecha_resolucion?: Date;

  @Column({
    type: DataType.TEXT
  })
  acciones_tomadas?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => Cirugia)
  cirugia!: Cirugia;

  @BelongsTo(() => Usuario, 'reportado_por_id')
  reportado_por!: Usuario;
} 