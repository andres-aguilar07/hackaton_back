import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { NivelComplejidad } from './types';
import Cirugia from './Cirugia';

@Table({
  tableName: 'tipos_cirugia',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class TipoCirugia extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true
  })
  nombre!: string;

  @Column({
    type: DataType.TEXT
  })
  descripcion?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  duracion_estimada_minutos!: number;

  @Column({
    type: DataType.ENUM(...Object.values(NivelComplejidad)),
    defaultValue: NivelComplejidad.MEDIA
  })
  nivel_complejidad!: NivelComplejidad;

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
  @HasMany(() => Cirugia)
  cirugias?: Cirugia[];
} 