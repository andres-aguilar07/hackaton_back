import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Usuario from './Usuario';
import Especialidad from './Especialidad';
import CirugiaPersonal from './CirugiaPersonal';
import Cirugia from './Cirugia';

@Table({
  tableName: 'medicos',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Medico extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true
  })
  usuario_id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  })
  numero_licencia!: string;

  @ForeignKey(() => Especialidad)
  @Column({
    type: DataType.INTEGER
  })
  especialidad_id?: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  anos_experiencia!: number;

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
  @BelongsTo(() => Usuario)
  usuario!: Usuario;

  @BelongsTo(() => Especialidad)
  especialidad?: Especialidad;

  @HasMany(() => Cirugia, 'cirujano_principal_id')
  cirugias_como_principal?: Cirugia[];

  @HasMany(() => CirugiaPersonal)
  participaciones_cirugias?: CirugiaPersonal[];
} 