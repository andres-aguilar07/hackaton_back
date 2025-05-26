import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { EstadoQuirofano } from './types';
import CategoriaQuirofano from './CategoriaQuirofano';
import Cirugia from './Cirugia';

@Table({
  tableName: 'quirofanos',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Quirofano extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  })
  nombre!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true
  })
  numero!: number;

  @ForeignKey(() => CategoriaQuirofano)
  @Column({
    type: DataType.INTEGER
  })
  categoria_id?: number;

  @Column({
    type: DataType.ENUM(...Object.values(EstadoQuirofano)),
    defaultValue: EstadoQuirofano.LIBRE
  })
  estado!: EstadoQuirofano;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 10
  })
  capacidad_personas!: number;

  @Column({
    type: DataType.TEXT
  })
  equipamiento_especial?: string;

  @Column({
    type: DataType.STRING(100)
  })
  ubicacion?: string;

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
  @BelongsTo(() => CategoriaQuirofano)
  categoria?: CategoriaQuirofano;

  @HasMany(() => Cirugia)
  cirugias?: Cirugia[];
} 