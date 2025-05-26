import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import Role from '../models/Role';
import Paciente from '../models/Paciente';
import Medico from '../models/Medico';
import Quirofano from '../models/Quirofano';
import CategoriaQuirofano from '../models/CategoriaQuirofano';
import EntidadSuministradora from '../models/EntidadSuministradora';
import TipoCirugia from '../models/TipoCirugia';
import Cirugia from '../models/Cirugia';
import CirugiaPersonal from '../models/CirugiaPersonal';
import CirugiaStockAsignado from '../models/CirugiaStockAsignado';
import ConteoInstrumentacion from '../models/ConteoInstrumentacion';
import Incidente from '../models/Incidente';
import { hashPassword } from '../helpers/auth';
import { Op } from 'sequelize';

// ==================== GESTIÓN DE USUARIOS ====================

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, apellido, email, password, cedula, telefono, rol_id } = req.body;

    // Verificar si el email ya existe
    const existingUserByEmail = await Usuario.findOne({ where: { email } });
    if (existingUserByEmail) {
      res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
      return;
    }

    // Verificar si la cédula ya existe
    const existingUserByCedula = await Usuario.findOne({ where: { cedula } });
    if (existingUserByCedula) {
      res.status(409).json({
        success: false,
        message: 'La cédula ya está registrada'
      });
      return;
    }

    // Verificar que el rol existe
    const role = await Role.findByPk(rol_id);
    if (!role) {
      res.status(400).json({
        success: false,
        message: 'El rol especificado no existe'
      });
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const newUser = await Usuario.create({
      nombre,
      apellido,
      email,
      password_hash: hashedPassword,
      cedula,
      telefono,
      rol_id,
      activo: true
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: newUser.id,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email,
        cedula: newUser.cedula,
        telefono: newUser.telefono,
        rol_id: newUser.rol_id,
        activo: newUser.activo
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Usuario.findAll({
      include: [{
        model: Role,
        as: 'rol'
      }],
      attributes: { exclude: ['password_hash'] },
      where: { deleted_at: null }
    });

    res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: users
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, cedula, telefono, rol_id, activo } = req.body;

    const user = await Usuario.findByPk(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Verificar que el rol existe si se está actualizando
    if (rol_id) {
      const role = await Role.findByPk(rol_id);
      if (!role) {
        res.status(400).json({
          success: false,
          message: 'El rol especificado no existe'
        });
        return;
      }
    }

    await user.update({
      nombre: nombre || user.nombre,
      apellido: apellido || user.apellido,
      email: email || user.email,
      cedula: cedula || user.cedula,
      telefono: telefono || user.telefono,
      rol_id: rol_id || user.rol_id,
      activo: activo !== undefined ? activo : user.activo
    });

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        cedula: user.cedula,
        telefono: user.telefono,
        rol_id: user.rol_id,
        activo: user.activo
      }
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await Usuario.findByPk(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ==================== GESTIÓN DE PACIENTES ====================

export const registerPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      nombre, 
      apellido, 
      cedula, 
      fecha_nacimiento, 
      telefono, 
      direccion, 
      tipo_sangre, 
      alergias, 
      condiciones_medicas, 
      contacto_emergencia_nombre, 
      contacto_emergencia_telefono 
    } = req.body;

    // Verificar si la cédula ya existe
    const existingPatient = await Paciente.findOne({ where: { cedula } });
    if (existingPatient) {
      res.status(409).json({
        success: false,
        message: 'Ya existe un paciente con esta cédula'
      });
      return;
    }

    const newPatient = await Paciente.create({
      nombre,
      apellido,
      cedula,
      fecha_nacimiento,
      telefono,
      direccion,
      tipo_sangre,
      alergias,
      condiciones_medicas,
      contacto_emergencia_nombre,
      contacto_emergencia_telefono
    });

    res.status(201).json({
      success: true,
      message: 'Paciente registrado exitosamente',
      data: newPatient
    });

  } catch (error) {
    console.error('Error al registrar paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Paciente.findAll({
      where: { deleted_at: null }
    });

    res.status(200).json({
      success: true,
      message: 'Pacientes obtenidos exitosamente',
      data: patients
    });

  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      apellido, 
      cedula, 
      fecha_nacimiento, 
      telefono, 
      direccion, 
      tipo_sangre, 
      alergias, 
      condiciones_medicas, 
      contacto_emergencia_nombre, 
      contacto_emergencia_telefono 
    } = req.body;

    const patient = await Paciente.findByPk(id);
    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
      return;
    }

    // Verificar si la nueva cédula ya existe en otro paciente
    if (cedula && cedula !== patient.cedula) {
      const existingPatient = await Paciente.findOne({ 
        where: { 
          cedula,
          id: { [Op.ne]: id }
        } 
      });
      if (existingPatient) {
        res.status(409).json({
          success: false,
          message: 'Ya existe otro paciente con esta cédula'
        });
        return;
      }
    }

    await patient.update({
      nombre: nombre || patient.nombre,
      apellido: apellido || patient.apellido,
      cedula: cedula || patient.cedula,
      fecha_nacimiento: fecha_nacimiento || patient.fecha_nacimiento,
      telefono: telefono || patient.telefono,
      direccion: direccion || patient.direccion,
      tipo_sangre: tipo_sangre || patient.tipo_sangre,
      alergias: alergias || patient.alergias,
      condiciones_medicas: condiciones_medicas || patient.condiciones_medicas,
      contacto_emergencia_nombre: contacto_emergencia_nombre || patient.contacto_emergencia_nombre,
      contacto_emergencia_telefono: contacto_emergencia_telefono || patient.contacto_emergencia_telefono
    });

    res.status(200).json({
      success: true,
      message: 'Paciente actualizado exitosamente',
      data: patient
    });

  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ==================== GESTIÓN DE QUIRÓFANOS ====================

export const createQuirofano = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      nombre, 
      numero, 
      categoria_id, 
      capacidad_personas, 
      equipamiento_especial, 
      ubicacion 
    } = req.body;

    // Verificar que el número no esté en uso
    const existingQuirofano = await Quirofano.findOne({ where: { numero } });
    if (existingQuirofano) {
      res.status(409).json({
        success: false,
        message: 'Ya existe un quirófano con este número'
      });
      return;
    }

    // Verificar que la categoría existe si se especifica
    if (categoria_id) {
      const categoria = await CategoriaQuirofano.findByPk(categoria_id);
      if (!categoria) {
        res.status(400).json({
          success: false,
          message: 'La categoría especificada no existe'
        });
        return;
      }
    }

    const newQuirofano = await Quirofano.create({
      nombre,
      numero,
      categoria_id,
      capacidad_personas,
      equipamiento_especial,
      ubicacion,
      activo: true
    });

    res.status(201).json({
      success: true,
      message: 'Quirófano creado exitosamente',
      data: newQuirofano
    });

  } catch (error) {
    console.error('Error al crear quirófano:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllQuirofanos = async (req: Request, res: Response): Promise<void> => {
  try {
    const quirofanos = await Quirofano.findAll({
      include: [{
        model: CategoriaQuirofano,
        as: 'categoria'
      }],
      where: { deleted_at: null }
    });

    res.status(200).json({
      success: true,
      message: 'Quirófanos obtenidos exitosamente',
      data: quirofanos
    });

  } catch (error) {
    console.error('Error al obtener quirófanos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateQuirofano = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      numero, 
      categoria_id, 
      capacidad_personas, 
      equipamiento_especial, 
      ubicacion, 
      activo 
    } = req.body;

    const quirofano = await Quirofano.findByPk(id);
    if (!quirofano) {
      res.status(404).json({
        success: false,
        message: 'Quirófano no encontrado'
      });
      return;
    }

    // Verificar que la categoría existe si se está actualizando
    if (categoria_id) {
      const categoria = await CategoriaQuirofano.findByPk(categoria_id);
      if (!categoria) {
        res.status(400).json({
          success: false,
          message: 'La categoría especificada no existe'
        });
        return;
      }
    }

    await quirofano.update({
      nombre: nombre || quirofano.nombre,
      numero: numero || quirofano.numero,
      categoria_id: categoria_id || quirofano.categoria_id,
      capacidad_personas: capacidad_personas || quirofano.capacidad_personas,
      equipamiento_especial: equipamiento_especial || quirofano.equipamiento_especial,
      ubicacion: ubicacion || quirofano.ubicacion,
      activo: activo !== undefined ? activo : quirofano.activo
    });

    res.status(200).json({
      success: true,
      message: 'Quirófano actualizado exitosamente',
      data: quirofano
    });

  } catch (error) {
    console.error('Error al actualizar quirófano:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getCategoriaQuirofanos = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await CategoriaQuirofano.findAll({
      where: { deleted_at: null }
    });

    res.status(200).json({
      success: true,
      message: 'Categorías de quirófanos obtenidas exitosamente',
      data: categorias
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ==================== GESTIÓN DE ENTIDADES SUMINISTRADORAS ====================

export const createEntidadSuministradora = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, tipo, ubicacion, telefono, responsable_id } = req.body;

    // Verificar que el responsable existe si se especifica
    if (responsable_id) {
      const responsable = await Usuario.findByPk(responsable_id);
      if (!responsable) {
        res.status(400).json({
          success: false,
          message: 'El responsable especificado no existe'
        });
        return;
      }
    }

    const newEntidad = await EntidadSuministradora.create({
      nombre,
      tipo,
      ubicacion,
      telefono,
      responsable_id,
      activo: true
    });

    res.status(201).json({
      success: true,
      message: 'Entidad suministradora creada exitosamente',
      data: newEntidad
    });

  } catch (error) {
    console.error('Error al crear entidad suministradora:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllEntidadesSuministradoras = async (req: Request, res: Response): Promise<void> => {
  try {
    const entidades = await EntidadSuministradora.findAll({
      include: [{
        model: Usuario,
        as: 'responsable',
        attributes: { exclude: ['password_hash'] }
      }],
      where: { deleted_at: null }
    });

    res.status(200).json({
      success: true,
      message: 'Entidades suministradoras obtenidas exitosamente',
      data: entidades
    });

  } catch (error) {
    console.error('Error al obtener entidades suministradoras:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ==================== GESTIÓN DE ESTÁNDARES DE CIRUGÍA ====================

export const createTipoCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, duracion_estimada_minutos, nivel_complejidad } = req.body;

    // Verificar que el nombre no esté en uso
    const existingTipo = await TipoCirugia.findOne({ where: { nombre } });
    if (existingTipo) {
      res.status(409).json({
        success: false,
        message: 'Ya existe un tipo de cirugía con este nombre'
      });
      return;
    }

    const newTipoCirugia = await TipoCirugia.create({
      nombre,
      descripcion,
      duracion_estimada_minutos,
      nivel_complejidad
    });

    res.status(201).json({
      success: true,
      message: 'Estándar de cirugía creado exitosamente',
      data: newTipoCirugia
    });

  } catch (error) {
    console.error('Error al crear tipo de cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllTiposCirugia = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipos = await TipoCirugia.findAll({
      where: { deleted_at: null }
    });

    res.status(200).json({
      success: true,
      message: 'Tipos de cirugía obtenidos exitosamente',
      data: tipos
    });

  } catch (error) {
    console.error('Error al obtener tipos de cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ==================== INFORMES DE CIRUGÍA ====================

export const getCirugiaReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cirugia = await Cirugia.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente'
        },
        {
          model: TipoCirugia,
          as: 'tipo_cirugia'
        },
        {
          model: Quirofano,
          as: 'quirofano',
          include: [{
            model: CategoriaQuirofano,
            as: 'categoria'
          }]
        },
        {
          model: Medico,
          as: 'cirujano_principal'
        },
        {
          model: Usuario,
          as: 'instrumentador',
          attributes: { exclude: ['password_hash'] }
        },
        {
          model: CirugiaPersonal,
          as: 'personal',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: { exclude: ['password_hash'] }
          }]
        },
        {
          model: CirugiaStockAsignado,
          as: 'stock_asignado',
          include: [{
            model: require('../models/Stock').default,
            as: 'stock'
          }]
        },
        {
          model: ConteoInstrumentacion,
          as: 'conteos',
          include: [{
            model: require('../models/DetalleConteo').default,
            as: 'detalles'
          }]
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
      message: 'Informe de cirugía obtenido exitosamente',
      data: cirugia
    });

  } catch (error) {
    console.error('Error al obtener informe de cirugía:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllCirugias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fecha_inicio, fecha_fin, estado, cirujano_id } = req.query;

    let whereClause: any = { deleted_at: null };

    // Filtros opcionales
    if (fecha_inicio && fecha_fin) {
      whereClause.fecha_programada = {
        [Op.between]: [fecha_inicio, fecha_fin]
      };
    }

    if (estado) {
      whereClause.estado = estado;
    }

    if (cirujano_id) {
      whereClause.cirujano_principal_id = cirujano_id;
    }

    const cirugias = await Cirugia.findAll({
      where: whereClause,
      include: [
        {
          model: Paciente,
          as: 'paciente'
        },
        {
          model: TipoCirugia,
          as: 'tipo_cirugia'
        },
        {
          model: Quirofano,
          as: 'quirofano'
        },
        {
          model: Medico,
          as: 'cirujano_principal'
        },
        {
          model: Usuario,
          as: 'instrumentador',
          attributes: { exclude: ['password_hash'] }
        }
      ],
      order: [['fecha_programada', 'DESC']]
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

// ==================== ESTADÍSTICAS ====================

export const getEstadisticas = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Cirugías del día
    const cirugiasDiaCount = await Cirugia.count({
      where: {
        fecha_programada: {
          [Op.between]: [startOfDay, endOfDay]
        },
        deleted_at: null
      }
    });

    // Cirugías en curso
    const cirugiaEnCursoCount = await Cirugia.count({
      where: {
        estado: 'EN_CURSO',
        deleted_at: null
      }
    });

    // Incidentes del mes
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const incidentesCount = await Incidente.count({
      where: {
        created_at: {
          [Op.gte]: startOfMonth
        }
      }
    });

    // Promedio de cirugías por día (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const cirugias30Dias = await Cirugia.count({
      where: {
        fecha_programada: {
          [Op.gte]: thirtyDaysAgo
        },
        deleted_at: null
      }
    });

    const promedioCirugiasDia = Math.round(cirugias30Dias / 30 * 100) / 100;

    // Quirófanos activos
    const quirofanosActivos = await Quirofano.count({
      where: {
        activo: true,
        deleted_at: null
      }
    });

    // Usuarios activos por rol
    const usuariosPorRol = await Usuario.findAll({
      include: [{
        model: Role,
        as: 'rol'
      }],
      where: {
        activo: true,
        deleted_at: null
      },
      attributes: ['rol_id', [require('sequelize').fn('COUNT', require('sequelize').col('Usuario.id')), 'count']],
      group: ['rol_id', 'rol.id', 'rol.nombre']
    });

    res.status(200).json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        cirugias_dia: cirugiasDiaCount,
        cirugias_en_curso: cirugiaEnCursoCount,
        incidentes_mes: incidentesCount,
        promedio_cirugias_dia: promedioCirugiasDia,
        quirofanos_activos: quirofanosActivos,
        usuarios_por_rol: usuariosPorRol
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ==================== GESTIÓN DE ROLES ====================

export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.findAll({
      where: { deleted_at: null }
    });

    res.status(200).json({
      success: true,
      message: 'Roles obtenidos exitosamente',
      data: roles
    });

  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 