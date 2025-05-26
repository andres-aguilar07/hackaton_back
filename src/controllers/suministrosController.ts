import { Op } from 'sequelize';
import Stock from '../models/Stock';
import Item from '../models/Item';
import CategoriaItem from '../models/CategoriaItem';
import EntidadSuministradora from '../models/EntidadSuministradora';
import CirugiaStockAsignado from '../models/CirugiaStockAsignado';
import Cirugia from '../models/Cirugia';
import Usuario from '../models/Usuario';
import EntregaStock from '../models/EntregaStock';
import { EstadoCirugia } from '../models/types';
import Notificacion from '../models/Notificacion';
import Esterilizacion from '../models/Esterilizacion';
import TipoCirugia from '../models/TipoCirugia';
import Quirofano from '../models/Quirofano';
import Medico from '../models/Medico';
import { Request, Response } from 'express';

// ==================== GESTIÓN DE STOCK ====================

export const getStock = async (req: any, res: any) => {
  try {
    const { tipo, categoria, disponible } = req.query;
    
    const where: any = {};
    const itemWhere: any = {};
    
    // Filtrar por tipo (reutilizable o no)
    if (tipo === 'reutilizable') {
      itemWhere.es_reutilizable = true;
    } else if (tipo === 'no_reutilizable') {
      itemWhere.es_reutilizable = false;
    }

    // Filtrar por categoría
    if (categoria) {
      itemWhere.categoria_id = categoria;
    }

    // Filtrar por disponibilidad
    if (disponible === 'true') {
      where.cantidad_disponible = { [Op.gt]: 0 };
    } else if (disponible === 'false') {
      where.cantidad_disponible = 0;
    }

    const stock = await Stock.findAll({
      where,
      include: [
        {
          model: Item,
          where: itemWhere,
          include: [{ model: CategoriaItem }]
        },
        { model: EntidadSuministradora }
      ]
    });

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error('Error al obtener stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener stock'
    });
  }
};

export const getStockEnUso = async (req: any, res: any) => {
  try {
    const { tipo, cirugia_id } = req.query;
    
    const where: any = {
      cantidad_en_uso: { [Op.gt]: 0 }
    };
    const itemWhere: any = {};
    const cirugiaWhere: any = {};

    // Filtrar por tipo de item
    if (tipo === 'reutilizable') {
      itemWhere.es_reutilizable = true;
    } else if (tipo === 'no_reutilizable') {
      itemWhere.es_reutilizable = false;
    }

    // Filtrar por cirugía específica
    if (cirugia_id) {
      cirugiaWhere.id = cirugia_id;
    }

    const stockEnUso = await Stock.findAll({
      where,
      include: [
        {
          model: Item,
          where: itemWhere,
          include: [
            { model: CategoriaItem },
            {
              model: CirugiaStockAsignado,
              include: [{
                model: Cirugia,
                where: cirugiaWhere,
                required: true
              }],
              required: true
            }
          ]
        },
        { model: EntidadSuministradora }
      ]
    });

    res.json({
      success: true,
      data: stockEnUso
    });
  } catch (error) {
    console.error('Error al obtener stock en uso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener stock en uso'
    });
  }
};

export const actualizarStock = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { cantidad, estado, ubicacion, observaciones } = req.body;

    const stock = await Stock.findByPk(id);
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock no encontrado'
      });
    }

    // Actualizar cantidad si se proporciona
    if (typeof cantidad === 'number') {
      stock.cantidad_disponible = cantidad;
    }

    // Actualizar ubicación si se proporciona
    if (ubicacion) {
      stock.ubicacion_almacen = ubicacion;
    }

    // Actualizar fecha de modificación
    stock.updated_at = new Date();

    await stock.save();

    // Si hay cambio de estado, registrar en historial (TODO: implementar historial)

    res.json({
      success: true,
      message: 'Stock actualizado correctamente',
      data: stock
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar stock'
    });
  }
};

export const getStockByEntidad = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const stock = await Stock.findAll({
      where: {
        entidad_suministradora_id: id
      },
      include: [{
        model: Item,
        attributes: ['nombre', 'descripcion', 'categoria']
      }]
    });

    return res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error('Error al obtener stock por entidad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el stock por entidad suministradora'
    });
  }
};

// ==================== GESTIÓN DE ENTREGAS ====================

export const entregarSuministros = async (req: any, res: any) => {
  try {
    const { cirugia_id, items, receptor_id, observaciones } = req.body;

    // Verificar que la cirugía existe
    const cirugia = await Cirugia.findByPk(cirugia_id);
    if (!cirugia) {
      return res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
    }

    // Verificar que el receptor existe
    const receptor = await Usuario.findByPk(receptor_id);
    if (!receptor) {
      return res.status(404).json({
        success: false,
        message: 'Receptor no encontrado'
      });
    }

    // Procesar cada item a entregar
    const entregas = [];
    for (const item of items) {
      const { item_id, cantidad, entidad_suministradora_id } = item;
      
      // Verificar stock disponible
      const stock = await Stock.findOne({
        where: {
          item_id,
          entidad_suministradora_id,
          cantidad_disponible: { [Op.gte]: cantidad }
        }
      });

      if (!stock) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el item ${item_id}`
        });
      }

      // Actualizar stock
      stock.cantidad_disponible -= cantidad;
      stock.cantidad_en_uso += cantidad;
      await stock.save();

      // Registrar entrega
      const entrega = await EntregaStock.create({
        cirugia_id,
        item_id,
        entidad_suministradora_id,
        cantidad_entregada: cantidad,
        entregado_por_id: req.usuario?.id, // Asumiendo que el usuario está en el any
        recibido_por_id: receptor_id,
        observaciones,
        fecha_entrega: new Date()
      });

      entregas.push(entrega);
    }

    res.json({
      success: true,
      message: 'Entrega registrada correctamente',
      data: entregas
    });
  } catch (error) {
    console.error('Error al registrar entrega:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar entrega'
    });
  }
};

export const registrarEntrega = async (req: any, res: any) => {
  try {
    const { entrega_id, receptor_id, cirugia_id, confirmacion_items } = req.body;

    // Verificar que la entrega existe
    const entrega = await EntregaStock.findByPk(entrega_id);
    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: 'Entrega no encontrada'
      });
    }

    // Verificar que el receptor existe
    const receptor = await Usuario.findByPk(receptor_id);
    if (!receptor) {
      return res.status(404).json({
        success: false,
        message: 'Receptor no encontrado'
      });
    }

    // Verificar que la cirugía coincide
    if (entrega.cirugia_id !== cirugia_id) {
      return res.status(400).json({
        success: false,
        message: 'La cirugía no coincide con la entrega'
      });
    }

    // Actualizar la entrega con la confirmación
    entrega.recibido_por_id = receptor_id;
    await entrega.save();

    // Procesar confirmación de items
    for (const item of confirmacion_items) {
      const { item_id, cantidad_recibida, observaciones } = item;

      // Verificar que el item corresponde a la entrega
      if (entrega.item_id !== item_id) {
        return res.status(400).json({
          success: false,
          message: `El item ${item_id} no corresponde a esta entrega`
        });
      }

      // Si la cantidad recibida es diferente a la entregada, registrar la discrepancia
      if (entrega.cantidad_entregada !== cantidad_recibida) {
        // TODO: Implementar registro de discrepancias
        console.log(`Discrepancia en item ${item_id}: Entregado: ${entrega.cantidad_entregada}, Recibido: ${cantidad_recibida}`);
      }

      // Actualizar observaciones si existen
      if (observaciones) {
        entrega.observaciones = observaciones;
        await entrega.save();
      }
    }

    res.json({
      success: true,
      message: 'Recepción registrada correctamente',
      data: entrega
    });
  } catch (error) {
    console.error('Error al registrar recepción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar recepción'
    });
  }
};

// ==================== GESTIÓN DE CIRUGÍAS ====================

export const asignarStockCirugia = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    // Verificar que la cirugía existe
    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      return res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
    }

    const asignaciones = [];
    for (const item of items) {
      const { item_id, cantidad, entidad_suministradora_id } = item;

      // Verificar stock disponible
      const stock = await Stock.findOne({
        where: {
          item_id,
          entidad_suministradora_id,
          cantidad_disponible: { [Op.gte]: cantidad }
        }
      });

      if (!stock) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el item ${item_id}`
        });
      }

      // Crear asignación
      const asignacion = await CirugiaStockAsignado.create({
        cirugia_id: id,
        item_id,
        stock_id: stock.id,
        cantidad_asignada: cantidad,
        asignado_por_id: req.usuario?.id,
        fecha_asignacion: new Date()
      });

      // Actualizar stock
      stock.cantidad_disponible -= cantidad;
      stock.cantidad_en_uso += cantidad;
      await stock.save();

      asignaciones.push(asignacion);
    }

    res.json({
      success: true,
      message: 'Stock asignado correctamente',
      data: asignaciones
    });
  } catch (error) {
    console.error('Error al asignar stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar stock'
    });
  }
};

export const getStockAsignadoCirugia = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Verificar que la cirugía existe
    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      return res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
    }

    // Obtener stock asignado con detalles
    const stockAsignado = await CirugiaStockAsignado.findAll({
      where: { cirugia_id: id },
      include: [
        {
          model: Stock,
          include: [
            { model: EntidadSuministradora },
            { 
              model: Item,
              include: [{ model: CategoriaItem }]
            }
          ]
        },
        {
          model: Usuario,
          as: 'asignado_por',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });

    res.json({
      success: true,
      data: stockAsignado
    });
  } catch (error) {
    console.error('Error al obtener stock asignado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener stock asignado'
    });
  }
};

export const agregarStockAdicional = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    // Verificar que la cirugía existe y está en curso
    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      return res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
    }

    if (cirugia.estado !== EstadoCirugia.EN_CURSO) {
      return res.status(400).json({
        success: false,
        message: 'Solo se puede agregar stock adicional a cirugías en curso'
      });
    }

    const asignacionesAdicionales = [];
    for (const item of items) {
      const { item_id, cantidad, entidad_suministradora_id, motivo } = item;

      // Verificar stock disponible
      const stock = await Stock.findOne({
        where: {
          item_id,
          entidad_suministradora_id,
          cantidad_disponible: { [Op.gte]: cantidad }
        }
      });

      if (!stock) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el item ${item_id}`
        });
      }

      // Crear asignación adicional
      const asignacion = await CirugiaStockAsignado.create({
        cirugia_id: id,
        item_id,
        stock_id: stock.id,
        cantidad_asignada: cantidad,
        asignado_por_id: req.usuario?.id,
        fecha_asignacion: new Date(),
        es_adicional: true,
        motivo_adicional: motivo
      });

      // Actualizar stock
      stock.cantidad_disponible -= cantidad;
      stock.cantidad_en_uso += cantidad;
      await stock.save();

      asignacionesAdicionales.push(asignacion);
    }

    res.json({
      success: true,
      message: 'Stock adicional agregado correctamente',
      data: asignacionesAdicionales
    });
  } catch (error) {
    console.error('Error al agregar stock adicional:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar stock adicional'
    });
  }
};

// ==================== NOTIFICACIONES ====================

export const getNotificaciones = async (req: any, res: any) => {
  try {
    const { tipo, urgencia, estado, fecha_inicio, fecha_fin } = req.query;
    
    const where: any = {};

    // Filtrar por tipo de notificación
    if (tipo) {
      where.tipo = tipo;
    }

    // Filtrar por urgencia
    if (urgencia) {
      where.es_urgente = urgencia === 'true';
    }

    // Filtrar por estado
    if (estado) {
      where.estado = estado;
    }

    // Filtrar por rango de fechas
    if (fecha_inicio || fecha_fin) {
      where.created_at = {};
      if (fecha_inicio) {
        where.created_at[Op.gte] = new Date(fecha_inicio as string);
      }
      if (fecha_fin) {
        where.created_at[Op.lte] = new Date(fecha_fin as string);
      }
    }

    const notificaciones = await Notificacion.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuario_destino',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Usuario,
          as: 'usuario_origen',
          attributes: ['id', 'nombre', 'apellido']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: notificaciones
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones'
    });
  }
};

export const marcarNotificacionLeida = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    // Verificar que la notificación pertenece al usuario actual
    if (notificacion.usuario_id !== req.usuario?.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para marcar esta notificación como leída'
      });
    }

    // Actualizar estado y fecha de lectura
    notificacion.leida = true;
    notificacion.fecha_lectura = new Date();
    await notificacion.save();

    res.json({
      success: true,
      message: 'Notificación marcada como leída',
      data: notificacion
    });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificación'
    });
  }
};

// ==================== ESTERILIZACIÓN ====================

export const registrarEsterilizacion = async (req: any, res: any) => {
  try {
    const { items } = req.body;

    const esterilizaciones = [];
    for (const item of items) {
      const { 
        item_id, 
        metodo_esterilizacion, 
        fecha_inicio, 
        fecha_fin_estimada,
        cirugia_origen_id,
        observaciones 
      } = item;

      // Verificar que el item existe y requiere esterilización
      const itemDb = await Item.findByPk(item_id);
      if (!itemDb) {
        return res.status(404).json({
          success: false,
          message: `Item ${item_id} no encontrado`
        });
      }

      if (!itemDb.requiere_esterilizacion) {
        return res.status(400).json({
          success: false,
          message: `El item ${item_id} no requiere esterilización`
        });
      }

      // Registrar proceso de esterilización
      const esterilizacion = await Esterilizacion.create({
        item_id,
        metodo_esterilizacion,
        fecha_inicio: fecha_inicio || new Date(),
        fecha_fin_estimada,
        cirugia_origen_id,
        estado: 'en_proceso',
        registrado_por_id: req.usuario?.id,
        observaciones
      });

      esterilizaciones.push(esterilizacion);
    }

    res.json({
      success: true,
      message: 'Esterilización registrada correctamente',
      data: esterilizaciones
    });
  } catch (error) {
    console.error('Error al registrar esterilización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar esterilización'
    });
  }
};

export const getHistorialEsterilizacion = async (req: any, res: any) => {
  try {
    const { instrumento_id, fecha_inicio, fecha_fin, cirugia_id } = req.query;
    
    const where: any = {};

    // Filtrar por instrumento específico
    if (instrumento_id) {
      where.item_id = instrumento_id;
    }

    // Filtrar por cirugía específica
    if (cirugia_id) {
      where.cirugia_origen_id = cirugia_id;
    }

    // Filtrar por rango de fechas
    if (fecha_inicio || fecha_fin) {
      where.fecha_inicio = {};
      if (fecha_inicio) {
        where.fecha_inicio[Op.gte] = new Date(fecha_inicio as string);
      }
      if (fecha_fin) {
        where.fecha_inicio[Op.lte] = new Date(fecha_fin as string);
      }
    }

    const historial = await Esterilizacion.findAll({
      where,
      include: [
        {
          model: Item,
          include: [{ model: CategoriaItem }]
        },
        {
          model: Usuario,
          as: 'registrado_por',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Cirugia,
          as: 'cirugia_origen',
          attributes: ['id', 'fecha_programada', 'estado']
        }
      ],
      order: [['fecha_inicio', 'DESC']]
    });

    res.json({
      success: true,
      data: historial
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial'
    });
  }
};

// ==================== MONITOREO EN TIEMPO REAL ====================

export const getProcedimientosConcurrentes = async (req: any, res: any) => {
  try {
    const { tipo } = req.query;
    
    const where: any = {
      estado: EstadoCirugia.EN_CURSO
    };

    // Filtrar por tipo de cirugía si se especifica
    if (tipo) {
      where.tipo_cirugia_id = tipo;
    }

    const procedimientos = await Cirugia.findAll({
      where,
      include: [
        {
          model: TipoCirugia,
          attributes: ['id', 'nombre', 'descripcion']
        },
        {
          model: Quirofano,
          attributes: ['id', 'nombre', 'ubicacion']
        },
        {
          model: Medico,
          as: 'cirujano_principal',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Usuario,
          as: 'instrumentador',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: CirugiaStockAsignado,
          include: [
            {
              model: Stock,
              include: [
                { 
                  model: Item,
                  include: [{ model: CategoriaItem }]
                }
              ]
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: procedimientos
    });
  } catch (error) {
    console.error('Error al obtener procedimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener procedimientos'
    });
  }
}; 