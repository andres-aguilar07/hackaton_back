import { Request, Response } from 'express';
import Cirugia from '../models/Cirugia';
import CirugiaPersonal from '../models/CirugiaPersonal';
import Paciente from '../models/Paciente';
import TipoCirugia from '../models/TipoCirugia';
import Quirofano from '../models/Quirofano';
import Medico from '../models/Medico';
import Usuario from '../models/Usuario';
import Role from '../models/Role';
import { EstadoCirugia, Prioridad, RolCirugia } from '../models/types';
import { Op } from 'sequelize';

// ==================== GESTIÓN DE CIRUGÍAS ====================

/**
 * @route   POST /api/v1/enfermera_jefe/cirugias
 * @desc    Crear una nueva cirugía y asignarla a un quirófano
 * @access  Enfermera Jefe
 */
export const createCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      paciente_id,
      tipo_cirugia_id,
      quirofano_id,
      cirujano_principal_id,
      instrumentador_id,
      fecha_programada,
      prioridad,
      observaciones_previas,
      diagnostico_preoperatorio,
      personal_auxiliar // Array de { medico_id, rol_en_cirugia }
    } = req.body;

    // Verificar que el quirófano esté disponible en la fecha programada
    const conflictoCirugia = await Cirugia.findOne({
      where: {
        quirofano_id,
        fecha_programada: {
          [Op.between]: [
            new Date(new Date(fecha_programada).getTime() - 2 * 60 * 60 * 1000), // 2 horas antes
            new Date(new Date(fecha_programada).getTime() + 2 * 60 * 60 * 1000)  // 2 horas después
          ]
        },
        estado: {
          [Op.not]: [EstadoCirugia.CANCELADA, EstadoCirugia.FINALIZADA]
        }
      }
    });

    if (conflictoCirugia) {
      res.status(409).json({
        success: false,
        message: 'El quirófano no está disponible en el horario solicitado'
      });
      return;
    }

    // Crear la cirugía
    const nuevaCirugia = await Cirugia.create({
      paciente_id,
      tipo_cirugia_id,
      quirofano_id,
      cirujano_principal_id,
      instrumentador_id,
      fecha_programada: new Date(fecha_programada),
      estado: EstadoCirugia.PROGRAMADA,
      prioridad: prioridad || Prioridad.MEDIA,
      observaciones_previas,
      diagnostico_preoperatorio
    });

    // Asignar personal auxiliar si se proporciona
    if (personal_auxiliar && personal_auxiliar.length > 0) {
      const personalPromises = personal_auxiliar.map((personal: any) =>
        CirugiaPersonal.create({
          cirugia_id: nuevaCirugia.id,
          medico_id: personal.medico_id,
          rol_en_cirugia: personal.rol_en_cirugia
        })
      );
      await Promise.all(personalPromises);
    }

    // Obtener la cirugía creada con todas las relaciones
    const cirugiaCompleta = await Cirugia.findByPk(nuevaCirugia.id, {
      include: [
        { model: Paciente, as: 'paciente' },
        { model: TipoCirugia, as: 'tipo_cirugia' },
        { model: Quirofano, as: 'quirofano' },
        { model: Medico, as: 'cirujano_principal' },
        { model: Usuario, as: 'instrumentador' },
        {
          model: CirugiaPersonal,
          as: 'personal',
          include: [{ model: Medico, as: 'medico' }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Cirugía creada y asignada exitosamente',
      data: cirugiaCompleta
    });

  } catch (error) {
    console.error('Error al crear cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   GET /api/v1/enfermera_jefe/cirugias
 * @desc    Obtener todas las cirugías con filtros opcionales
 * @access  Enfermera Jefe
 */
export const getAllCirugias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      fecha_inicio, 
      fecha_fin, 
      estado, 
      quirofano_id, 
      cirujano_id,
      prioridad 
    } = req.query;

    const whereConditions: any = {};

    // Filtros de fecha
    if (fecha_inicio || fecha_fin) {
      whereConditions.fecha_programada = {};
      if (fecha_inicio) {
        whereConditions.fecha_programada[Op.gte] = new Date(fecha_inicio as string);
      }
      if (fecha_fin) {
        whereConditions.fecha_programada[Op.lte] = new Date(fecha_fin as string);
      }
    }

    // Otros filtros
    if (estado) whereConditions.estado = estado;
    if (quirofano_id) whereConditions.quirofano_id = quirofano_id;
    if (cirujano_id) whereConditions.cirujano_principal_id = cirujano_id;
    if (prioridad) whereConditions.prioridad = prioridad;

    const cirugias = await Cirugia.findAll({
      where: whereConditions,
      include: [
        { model: Paciente, as: 'paciente' },
        { model: TipoCirugia, as: 'tipo_cirugia' },
        { model: Quirofano, as: 'quirofano' },
        { model: Medico, as: 'cirujano_principal' },
        { model: Usuario, as: 'instrumentador' },
        {
          model: CirugiaPersonal,
          as: 'personal',
          include: [{ model: Medico, as: 'medico' }]
        }
      ],
      order: [['fecha_programada', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Cirugías obtenidas exitosamente',
      data: cirugias
    });

  } catch (error) {
    console.error('Error al obtener cirugías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   GET /api/v1/enfermera_jefe/cirugias/:id
 * @desc    Obtener detalles de una cirugía específica
 * @access  Enfermera Jefe
 */
export const getCirugiaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cirugia = await Cirugia.findByPk(id, {
      include: [
        { model: Paciente, as: 'paciente' },
        { model: TipoCirugia, as: 'tipo_cirugia' },
        { model: Quirofano, as: 'quirofano' },
        { model: Medico, as: 'cirujano_principal' },
        { model: Usuario, as: 'instrumentador' },
        {
          model: CirugiaPersonal,
          as: 'personal',
          include: [{ model: Medico, as: 'medico' }]
        }
      ]
    });

    if (!cirugia) {
      res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Cirugía obtenida exitosamente',
      data: cirugia
    });

  } catch (error) {
    console.error('Error al obtener cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id
 * @desc    Editar una cirugía existente
 * @access  Enfermera Jefe
 */
export const updateCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      paciente_id,
      tipo_cirugia_id,
      quirofano_id,
      cirujano_principal_id,
      instrumentador_id,
      fecha_programada,
      prioridad,
      observaciones_previas,
      diagnostico_preoperatorio,
      personal_auxiliar
    } = req.body;

    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
      return;
    }

    // No permitir editar cirugías en curso o finalizadas
    if ([EstadoCirugia.EN_CURSO, EstadoCirugia.FINALIZADA].includes(cirugia.estado)) {
      res.status(400).json({
        success: false,
        message: 'No se puede editar una cirugía en curso o finalizada'
      });
      return;
    }

    // Si se cambia el quirófano o la fecha, verificar disponibilidad
    if ((quirofano_id && quirofano_id !== cirugia.quirofano_id) || 
        (fecha_programada && new Date(fecha_programada).getTime() !== cirugia.fecha_programada.getTime())) {
      
      const nuevaFecha = fecha_programada ? new Date(fecha_programada) : cirugia.fecha_programada;
      const nuevoQuirofano = quirofano_id || cirugia.quirofano_id;

      const conflictoCirugia = await Cirugia.findOne({
        where: {
          id: { [Op.ne]: id },
          quirofano_id: nuevoQuirofano,
          fecha_programada: {
            [Op.between]: [
              new Date(nuevaFecha.getTime() - 2 * 60 * 60 * 1000),
              new Date(nuevaFecha.getTime() + 2 * 60 * 60 * 1000)
            ]
          },
          estado: {
            [Op.not]: [EstadoCirugia.CANCELADA, EstadoCirugia.FINALIZADA]
          }
        }
      });

      if (conflictoCirugia) {
        res.status(409).json({
          success: false,
          message: 'El quirófano no está disponible en el nuevo horario'
        });
        return;
      }
    }

    // Actualizar la cirugía
    await cirugia.update({
      paciente_id: paciente_id || cirugia.paciente_id,
      tipo_cirugia_id: tipo_cirugia_id || cirugia.tipo_cirugia_id,
      quirofano_id: quirofano_id || cirugia.quirofano_id,
      cirujano_principal_id: cirujano_principal_id || cirugia.cirujano_principal_id,
      instrumentador_id: instrumentador_id || cirugia.instrumentador_id,
      fecha_programada: fecha_programada ? new Date(fecha_programada) : cirugia.fecha_programada,
      prioridad: prioridad || cirugia.prioridad,
      observaciones_previas: observaciones_previas || cirugia.observaciones_previas,
      diagnostico_preoperatorio: diagnostico_preoperatorio || cirugia.diagnostico_preoperatorio
    });

    // Actualizar personal auxiliar si se proporciona
    if (personal_auxiliar) {
      // Eliminar personal existente
      await CirugiaPersonal.destroy({ where: { cirugia_id: id } });
      
      // Agregar nuevo personal
      if (personal_auxiliar.length > 0) {
        const personalPromises = personal_auxiliar.map((personal: any) =>
          CirugiaPersonal.create({
            cirugia_id: parseInt(id),
            medico_id: personal.medico_id,
            rol_en_cirugia: personal.rol_en_cirugia
          })
        );
        await Promise.all(personalPromises);
      }
    }

    // Obtener la cirugía actualizada
    const cirugiaActualizada = await Cirugia.findByPk(id, {
      include: [
        { model: Paciente, as: 'paciente' },
        { model: TipoCirugia, as: 'tipo_cirugia' },
        { model: Quirofano, as: 'quirofano' },
        { model: Medico, as: 'cirujano_principal' },
        { model: Usuario, as: 'instrumentador' },
        {
          model: CirugiaPersonal,
          as: 'personal',
          include: [{ model: Usuario, as: 'usuario' }]
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Cirugía actualizada exitosamente',
      data: cirugiaActualizada
    });

  } catch (error) {
    console.error('Error al actualizar cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id/posponer
 * @desc    Posponer una cirugía
 * @access  Enfermera Jefe
 */
export const posponerCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nueva_fecha, motivo } = req.body;

    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
      return;
    }

    // No permitir posponer cirugías en curso o finalizadas
    if ([EstadoCirugia.EN_CURSO, EstadoCirugia.FINALIZADA].includes(cirugia.estado)) {
      res.status(400).json({
        success: false,
        message: 'No se puede posponer una cirugía en curso o finalizada'
      });
      return;
    }

    // Verificar disponibilidad del quirófano en la nueva fecha
    if (nueva_fecha) {
      const conflictoCirugia = await Cirugia.findOne({
        where: {
          id: { [Op.ne]: id },
          quirofano_id: cirugia.quirofano_id,
          fecha_programada: {
            [Op.between]: [
              new Date(new Date(nueva_fecha).getTime() - 2 * 60 * 60 * 1000),
              new Date(new Date(nueva_fecha).getTime() + 2 * 60 * 60 * 1000)
            ]
          },
          estado: {
            [Op.not]: [EstadoCirugia.CANCELADA, EstadoCirugia.FINALIZADA]
          }
        }
      });

      if (conflictoCirugia) {
        res.status(409).json({
          success: false,
          message: 'El quirófano no está disponible en la nueva fecha'
        });
        return;
      }
    }

    // Posponer la cirugía
    await cirugia.update({
      estado: EstadoCirugia.POSPUESTA,
      fecha_programada: nueva_fecha ? new Date(nueva_fecha) : cirugia.fecha_programada,
      observaciones_previas: cirugia.observaciones_previas 
        ? `${cirugia.observaciones_previas}\n\nCIRUGÍA POSPUESTA: ${motivo || 'Sin motivo especificado'}`
        : `CIRUGÍA POSPUESTA: ${motivo || 'Sin motivo especificado'}`
    });

    res.status(200).json({
      success: true,
      message: 'Cirugía pospuesta exitosamente',
      data: cirugia
    });

  } catch (error) {
    console.error('Error al posponer cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   DELETE /api/v1/enfermera_jefe/cirugias/:id
 * @desc    Eliminar (cancelar) una cirugía
 * @access  Enfermera Jefe
 */
export const deleteCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
      return;
    }

    // No permitir eliminar cirugías en curso o finalizadas
    if ([EstadoCirugia.EN_CURSO, EstadoCirugia.FINALIZADA].includes(cirugia.estado)) {
      res.status(400).json({
        success: false,
        message: 'No se puede eliminar una cirugía en curso o finalizada'
      });
      return;
    }

    // Marcar como cancelada en lugar de eliminar completamente
    await cirugia.update({
      estado: EstadoCirugia.CANCELADA,
      observaciones_previas: cirugia.observaciones_previas 
        ? `${cirugia.observaciones_previas}\n\nCIRUGÍA CANCELADA: ${motivo || 'Sin motivo especificado'}`
        : `CIRUGÍA CANCELADA: ${motivo || 'Sin motivo especificado'}`
    });

    res.status(200).json({
      success: true,
      message: 'Cirugía cancelada exitosamente'
    });

  } catch (error) {
    console.error('Error al cancelar cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id/iniciar
 * @desc    Iniciar una cirugía
 * @access  Enfermera Jefe
 */
export const iniciarCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
      return;
    }

    // Verificar que la cirugía esté en estado apropiado para iniciar
    if (![EstadoCirugia.PROGRAMADA, EstadoCirugia.EN_PREPARACION].includes(cirugia.estado)) {
      res.status(400).json({
        success: false,
        message: 'La cirugía no puede ser iniciada desde su estado actual'
      });
      return;
    }

    // Iniciar la cirugía
    await cirugia.update({
      estado: EstadoCirugia.EN_CURSO,
      fecha_inicio: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Cirugía iniciada exitosamente',
      data: {
        id: cirugia.id,
        estado: cirugia.estado,
        fecha_inicio: cirugia.fecha_inicio
      }
    });

  } catch (error) {
    console.error('Error al iniciar cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id/finalizar
 * @desc    Finalizar una cirugía
 * @access  Enfermera Jefe
 */
export const finalizarCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      observaciones_finales, 
      diagnostico_postoperatorio,
      observaciones_cirujano,
      observaciones_anestesiologo 
    } = req.body;

    const cirugia = await Cirugia.findByPk(id);
    if (!cirugia) {
      res.status(404).json({
        success: false,
        message: 'Cirugía no encontrada'
      });
      return;
    }

    // Verificar que la cirugía esté en curso
    if (cirugia.estado !== EstadoCirugia.EN_CURSO) {
      res.status(400).json({
        success: false,
        message: 'Solo se pueden finalizar cirugías que estén en curso'
      });
      return;
    }

    // Calcular duración si hay fecha de inicio
    let duracion_real_minutos;
    if (cirugia.fecha_inicio) {
      const ahora = new Date();
      duracion_real_minutos = Math.round((ahora.getTime() - cirugia.fecha_inicio.getTime()) / (1000 * 60));
    }

    // Construir observaciones finales completas
    let observaciones_completas = '';
    if (observaciones_finales) {
      observaciones_completas += `OBSERVACIONES GENERALES:\n${observaciones_finales}\n\n`;
    }
    if (observaciones_cirujano) {
      observaciones_completas += `OBSERVACIONES DEL CIRUJANO:\n${observaciones_cirujano}\n\n`;
    }
    if (observaciones_anestesiologo) {
      observaciones_completas += `OBSERVACIONES DEL ANESTESIÓLOGO:\n${observaciones_anestesiologo}\n\n`;
    }

    // Finalizar la cirugía
    await cirugia.update({
      estado: EstadoCirugia.FINALIZADA,
      fecha_fin: new Date(),
      duracion_real_minutos,
      observaciones_finales: observaciones_completas.trim(),
      diagnostico_postoperatorio
    });

    res.status(200).json({
      success: true,
      message: 'Cirugía finalizada exitosamente',
      data: {
        id: cirugia.id,
        estado: cirugia.estado,
        fecha_fin: cirugia.fecha_fin,
        duracion_real_minutos,
        observaciones_finales: cirugia.observaciones_finales,
        diagnostico_postoperatorio: cirugia.diagnostico_postoperatorio
      }
    });

  } catch (error) {
    console.error('Error al finalizar cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ==================== GESTIÓN DE PERSONAL EN CIRUGÍAS ====================

/**
 * @route   GET /api/v1/enfermera_jefe/personal-disponible
 * @desc    Obtener personal médico disponible para asignar a cirugías
 * @access  Enfermera Jefe
 */
export const getPersonalDisponible = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tipo_personal, fecha } = req.query;

    let whereConditions: any = { activo: true };
    let includeConditions: any = {
      model: Role,
      as: 'rol'
    };

    // Filtrar por tipo de personal si se especifica
    if (tipo_personal) {
      if (tipo_personal === 'cirujanos') {
        // Obtener médicos
        const medicos = await Medico.findAll({
          include: [
            {
              model: Usuario,
              as: 'usuario',
              where: { activo: true },
              include: [{ model: Role, as: 'rol' }]
            }
          ]
        });

        res.status(200).json({
          success: true,
          message: 'Cirujanos disponibles obtenidos exitosamente',
          data: medicos
        });
        return;
      } else {
        // Para otros tipos de personal, filtrar por rol
        const rolesMap: { [key: string]: string[] } = {
          'instrumentadores': ['instrumentador'],
          'anestesiologos': ['anestesiologo', 'medico'],
          'auxiliares': ['auxiliar_enfermeria', 'residente']
        };

        if (rolesMap[tipo_personal as string]) {
          includeConditions.where = {
            nombre: { [Op.in]: rolesMap[tipo_personal as string] }
          };
        }
      }
    }

    const personal = await Usuario.findAll({
      where: whereConditions,
      include: [includeConditions],
      attributes: { exclude: ['password_hash'] }
    });

    res.status(200).json({
      success: true,
      message: 'Personal disponible obtenido exitosamente',
      data: personal
    });

  } catch (error) {
    console.error('Error al obtener personal disponible:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @route   GET /api/v1/enfermera_jefe/quirofanos-disponibles
 * @desc    Obtener quirófanos disponibles para una fecha específica
 * @access  Enfermera Jefe
 */
export const getQuirofanosDisponibles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fecha, hora } = req.query;

    if (!fecha || !hora) {
      res.status(400).json({
        success: false,
        message: 'Fecha y hora son requeridas'
      });
      return;
    }

    const fechaHora = new Date(`${fecha} ${hora}`);
    
    // Obtener todos los quirófanos
    const todosQuirofanos = await Quirofano.findAll({
      where: { activo: true }
    });

    // Obtener quirófanos ocupados en el horario solicitado (±2 horas)
    const quirofanosOcupados = await Cirugia.findAll({
      where: {
        fecha_programada: {
          [Op.between]: [
            new Date(fechaHora.getTime() - 2 * 60 * 60 * 1000),
            new Date(fechaHora.getTime() + 2 * 60 * 60 * 1000)
          ]
        },
        estado: {
          [Op.not]: [EstadoCirugia.CANCELADA, EstadoCirugia.FINALIZADA]
        }
      },
      attributes: ['quirofano_id']
    });

    const idsOcupados = quirofanosOcupados.map(c => c.quirofano_id);
    
    const quirofanosDisponibles = todosQuirofanos.filter(q => !idsOcupados.includes(q.id));

    res.status(200).json({
      success: true,
      message: 'Quirófanos disponibles obtenidos exitosamente',
      data: quirofanosDisponibles
    });

  } catch (error) {
    console.error('Error al obtener quirófanos disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 