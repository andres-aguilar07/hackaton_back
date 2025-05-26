import { Router } from 'express';
import { iniciarCirugia, finalizarCirugia } from '../controllers/enfermeraJefeController';
import { getCirugiasAsignadas, solicitarInstrumentos, iniciarConteoInicial, finalizarConteoInicial, solicitarInstrumentoAdicional, reportarInstrumentoDanado, iniciarConteoFinal, finalizarConteoFinal, reportarIncidente, getTiempoCirugia, getInstrumentosActuales } from '../controllers/instrumentadorController';


const router = Router();

// ==================== GESTIÓN DE CIRUGÍAS ====================

/**
 * @route   GET /api/v1/instrumentador/cirugias
 * @desc    Obtener cirugías asignadas al instrumentador
 * @access  Instrumentador
 * @query   {
 *   fecha?: string (YYYY-MM-DD),
 *   estado?: string (pendiente|en_curso|finalizada)
 * }
 */
router.get('/cirugias', getCirugiasAsignadas);

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/solicitar-instrumentos
 * @desc    Solicitar instrumentos para una cirugía antes de iniciar
 * @access  Instrumentador
 * @body    {
 *   instrumentos: Array<{
 *     instrumento_id: number,
 *     cantidad: number,
 *     tipo: string (central|farmacia),
 *     observaciones?: string
 *   }>
 * }
 */
router.post('/cirugias/:id/solicitar-instrumentos', solicitarInstrumentos);

// ==================== CONTROL DE CIRUGÍA ====================

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/iniciar
 * @desc    Iniciar una cirugía asignada
 * @access  Instrumentador
 * @body    {
 *   quirofano_id: number,
 *   observaciones_inicio?: string
 * }
 */
router.post('/cirugias/:id/iniciar', iniciarCirugia);

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/finalizar
 * @desc    Finalizar una cirugía en curso
 * @access  Instrumentador
 * @body    {
 *   observaciones_finales?: string,
 *   estado_instrumentos: string
 * }
 */
router.post('/cirugias/:id/finalizar', finalizarCirugia);

// ==================== GESTIÓN DE INSTRUMENTOS ====================

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/conteo-inicial
 * @desc    Iniciar conteo inicial de instrumentos
 * @access  Instrumentador
 */
router.post('/cirugias/:id/conteo-inicial', iniciarConteoInicial);

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/conteo-inicial/finalizar
 * @desc    Finalizar conteo inicial y confirmar instrumentos
 * @access  Instrumentador
 * @body    {
 *   instrumentos: Array<{
 *     instrumento_id: number,
 *     estado: string (presente|faltante|adicional_requerido),
 *     cantidad_actual: number,
 *     cantidad_requerida?: number,
 *     observaciones?: string
 *   }>,
 *   confirmacion: boolean
 * }
 */
router.post('/cirugias/:id/conteo-inicial/finalizar', finalizarConteoInicial);

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/solicitar-adicional
 * @desc    Solicitar instrumento adicional durante la cirugía
 * @access  Instrumentador
 * @body    {
 *   tipo: string (central|farmacia),
 *   instrumento_id: number,
 *   cantidad: number,
 *   urgencia: boolean,
 *   motivo: string
 * }
 */
router.post('/cirugias/:id/solicitar-adicional', solicitarInstrumentoAdicional);

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/reportar-danado
 * @desc    Reportar instrumento dañado durante la cirugía
 * @access  Instrumentador
 * @body    {
 *   instrumento_id: number,
 *   tipo_dano: string,
 *   descripcion: string,
 *   impacto_cirugia?: string
 * }
 */
router.post('/cirugias/:id/reportar-danado', reportarInstrumentoDanado);

// ==================== CONTEO FINAL Y REPORTES ====================

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/conteo-final
 * @desc    Iniciar conteo final de instrumentos
 * @access  Instrumentador
 */
router.post('/cirugias/:id/conteo-final', iniciarConteoFinal);

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/conteo-final/finalizar
 * @desc    Finalizar conteo final y reportar estado
 * @access  Instrumentador
 * @body    {
 *   instrumentos: Array<{
 *     instrumento_id: number,
 *     estado_final: string (correcto|perdido|contaminado|danado),
 *     cantidad_final: number,
 *     observaciones?: string
 *   }>,
 *   confirmacion: boolean
 * }
 */
router.post('/cirugias/:id/conteo-final/finalizar', finalizarConteoFinal);

/**
 * @route   POST /api/v1/instrumentador/cirugias/:id/reportar-incidente
 * @desc    Reportar incidente grave durante o después de la cirugía
 * @access  Instrumentador
 * @body    {
 *   tipo_incidente: string (instrumento_perdido|instrumento_contaminado|instrumento_danado|otro),
 *   descripcion: string,
 *   impacto: string,
 *   acciones_tomadas?: string,
 *   requiere_accion_inmediata: boolean
 * }
 */
router.post('/cirugias/:id/reportar-incidente', reportarIncidente);

// ==================== MONITOREO EN TIEMPO REAL ====================

/**
 * @route   GET /api/v1/instrumentador/cirugias/:id/tiempo
 * @desc    Obtener tiempo transcurrido de la cirugía
 * @access  Instrumentador
 */
router.get('/cirugias/:id/tiempo', getTiempoCirugia);

/**
 * @route   GET /api/v1/instrumentador/cirugias/:id/instrumentos-actuales
 * @desc    Obtener listado de instrumentos actualmente en uso
 * @access  Instrumentador
 * @query   {
 *   tipo?: string (central|farmacia),
 *   estado?: string
 * }
 */
router.get('/cirugias/:id/instrumentos-actuales', getInstrumentosActuales);

export default router; 