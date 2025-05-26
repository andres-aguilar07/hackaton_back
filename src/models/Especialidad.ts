import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import Medico from './Medico';

@Table({
  tableName: 'especialidades',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Especialidad extends Model {
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
  @HasMany(() => Medico)
  medicos?: Medico[];
} 