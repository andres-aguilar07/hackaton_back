import { Router } from 'express';
import {
  // Gestión de cirugías
  createCirugia,
  getAllCirugias,
  getCirugiaById,
  updateCirugia,
  posponerCirugia,
  deleteCirugia,
  iniciarCirugia,
  finalizarCirugia,
  
  // Gestión de recursos
  getPersonalDisponible,
  getQuirofanosDisponibles
} from '../controllers/enfermeraJefeController';

const router = Router();

// ==================== GESTIÓN DE CIRUGÍAS ====================

/**
 * @route   POST /api/v1/enfermera_jefe/cirugias
 * @desc    Crear una nueva cirugía y asignarla a un quirófano
 * @access  Enfermera Jefe
 * @body    {
 *   paciente_id: number,
 *   tipo_cirugia_id: number,
 *   quirofano_id: number,
 *   cirujano_principal_id: number,
 *   instrumentador_id?: number,
 *   fecha_programada: string (ISO),
 *   prioridad?: string,
 *   observaciones_previas?: string,
 *   diagnostico_preoperatorio?: string,
 *   personal_auxiliar?: Array<{usuario_id: number, rol_cirugia: string}>
 * }
 */
router.post('/cirugias', createCirugia);

/**
 * @route   GET /api/v1/enfermera_jefe/cirugias
 * @desc    Obtener todas las cirugías con filtros opcionales
 * @access  Enfermera Jefe
 * @query   {
 *   fecha_inicio?: string,
 *   fecha_fin?: string,
 *   estado?: string,
 *   quirofano_id?: number,
 *   cirujano_id?: number,
 *   prioridad?: string
 * }
 */
router.get('/cirugias', getAllCirugias);

/**
 * @route   GET /api/v1/enfermera_jefe/cirugias/:id
 * @desc    Obtener detalles de una cirugía específica
 * @access  Enfermera Jefe
 */
router.get('/cirugias/:id', getCirugiaById);

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id
 * @desc    Editar una cirugía existente
 * @access  Enfermera Jefe
 * @body    {
 *   paciente_id?: number,
 *   tipo_cirugia_id?: number,
 *   quirofano_id?: number,
 *   cirujano_principal_id?: number,
 *   instrumentador_id?: number,
 *   fecha_programada?: string (ISO),
 *   prioridad?: string,
 *   observaciones_previas?: string,
 *   diagnostico_preoperatorio?: string,
 *   personal_auxiliar?: Array<{usuario_id: number, rol_cirugia: string}>
 * }
 */
router.put('/cirugias/:id', updateCirugia);

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id/posponer
 * @desc    Posponer una cirugía
 * @access  Enfermera Jefe
 * @body    {
 *   nueva_fecha?: string (ISO),
 *   motivo?: string
 * }
 */
router.put('/cirugias/:id/posponer', posponerCirugia);

/**
 * @route   DELETE /api/v1/enfermera_jefe/cirugias/:id
 * @desc    Eliminar (cancelar) una cirugía
 * @access  Enfermera Jefe
 * @body    {
 *   motivo?: string
 * }
 */
router.delete('/cirugias/:id', deleteCirugia);

// ==================== CONTROL DE ESTADO DE CIRUGÍAS ====================

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id/iniciar
 * @desc    Iniciar una cirugía (cambiar estado a "en_curso")
 * @access  Enfermera Jefe
 * @note    Solo se pueden iniciar cirugías en estado "programada" o "en_preparacion"
 */
router.put('/cirugias/:id/iniciar', iniciarCirugia);

/**
 * @route   PUT /api/v1/enfermera_jefe/cirugias/:id/finalizar
 * @desc    Finalizar una cirugía y añadir observaciones finales
 * @access  Enfermera Jefe
 * @body    {
 *   observaciones_finales?: string,
 *   diagnostico_postoperatorio?: string,
 *   observaciones_cirujano?: string,
 *   observaciones_anestesiologo?: string
 * }
 * @note    Solo se pueden finalizar cirugías en estado "en_curso"
 */
router.put('/cirugias/:id/finalizar', finalizarCirugia);

// ==================== GESTIÓN DE RECURSOS ====================

/**
 * @route   GET /api/v1/enfermera_jefe/personal-disponible
 * @desc    Obtener personal médico disponible para asignar a cirugías
 * @access  Enfermera Jefe
 * @query   {
 *   tipo_personal?: string (cirujanos|instrumentadores|anestesiologos|auxiliares),
 *   fecha?: string (ISO)
 * }
 */
router.get('/personal-disponible', getPersonalDisponible);

/**
 * @route   GET /api/v1/enfermera_jefe/quirofanos-disponibles
 * @desc    Obtener quirófanos disponibles para una fecha y hora específica
 * @access  Enfermera Jefe
 * @query   {
 *   fecha: string (YYYY-MM-DD),
 *   hora: string (HH:MM)
 * }
 */
router.get('/quirofanos-disponibles', getQuirofanosDisponibles);

export default router; 