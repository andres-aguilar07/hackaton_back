import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Usuario from './Usuario';

@Table({
  tableName: 'sesiones_usuario',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class SesionUsuario extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  usuario_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true
  })
  token_sesion!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  fecha_inicio!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  fecha_expiracion!: Date;

  @Column({
    type: DataType.STRING(45)
  })
  ip_address?: string;

  @Column({
    type: DataType.TEXT
  })
  user_agent?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  activa!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => Usuario)
  usuario!: Usuario;
} 