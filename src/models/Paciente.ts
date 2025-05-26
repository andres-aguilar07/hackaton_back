import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { TipoSangre } from './types';
import Cirugia from './Cirugia';

@Table({
  tableName: 'pacientes',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Paciente extends Model {
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
    type: DataType.STRING(20),
    allowNull: false,
    unique: true
  })
  cedula!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  fecha_nacimiento!: Date;

  @Column({
    type: DataType.STRING(20)
  })
  telefono?: string;

  @Column({
    type: DataType.TEXT
  })
  direccion?: string;

  @Column({
    type: DataType.ENUM(...Object.values(TipoSangre))
  })
  tipo_sangre?: TipoSangre;

  @Column({
    type: DataType.TEXT
  })
  alergias?: string;

  @Column({
    type: DataType.TEXT
  })
  condiciones_medicas?: string;

  @Column({
    type: DataType.STRING(100)
  })
  contacto_emergencia_nombre?: string;

  @Column({
    type: DataType.STRING(20)
  })
  contacto_emergencia_telefono?: string;

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
  @HasMany(() => Cirugia)
  cirugias?: Cirugia[];
} 