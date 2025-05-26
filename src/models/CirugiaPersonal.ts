import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { RolCirugia } from './types';
import Cirugia from './Cirugia';
import Medico from './Medico';

@Table({
  tableName: 'cirugia_personal',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class CirugiaPersonal extends Model {
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

  @ForeignKey(() => Medico)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  medico_id!: number;

  @Column({
    type: DataType.ENUM(...Object.values(RolCirugia)),
    allowNull: false
  })
  rol_en_cirugia!: RolCirugia;

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
  @BelongsTo(() => Cirugia)
  cirugia!: Cirugia;

  @BelongsTo(() => Medico)
  medico!: Medico;
} 