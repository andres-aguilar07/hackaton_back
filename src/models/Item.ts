import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import CategoriaItem from './CategoriaItem';
import CirugiaStockAsignado from './CirugiaStockAsignado';
import DetalleConteo from './DetalleConteo';
import EntregaStock from './EntregaStock';
import Esterilizacion from './Esterilizacion';
import SolicitudCirugia from './SolicitudCirugia';
import Stock from './Stock';


@Table({
  tableName: 'items',
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at'
})
export default class Item extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  nombre!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true
  })
  codigo!: string;

  @ForeignKey(() => CategoriaItem)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  categoria_id!: number;

  @Column({
    type: DataType.TEXT
  })
  descripcion?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  es_reutilizable!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  requiere_esterilizacion!: boolean;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0.00
  })
  precio_unitario!: number;

  @Column({
    type: DataType.STRING(20),
    defaultValue: 'unidad'
  })
  unidad_medida!: string;

  @Column({
    type: DataType.STRING(200)
  })
  proveedor?: string;

  @Column({
    type: DataType.DATEONLY
  })
  fecha_vencimiento?: Date;

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
    allowNull: true
  })
  deleted_at?: Date;

  // Associations
  @BelongsTo(() => CategoriaItem)
  categoria!: CategoriaItem;

  @HasMany(() => Stock)
  stocks?: Stock[];

  @HasMany(() => CirugiaStockAsignado)
  asignaciones?: CirugiaStockAsignado[];

  @HasMany(() => DetalleConteo)
  conteos?: DetalleConteo[];

  @HasMany(() => EntregaStock)
  entregas?: EntregaStock[];

  @HasMany(() => SolicitudCirugia)
  solicitudes?: SolicitudCirugia[];

  @HasMany(() => Esterilizacion)
  esterilizaciones?: Esterilizacion[];
} 