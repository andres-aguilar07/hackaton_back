import { Router } from 'express';
import { getStock, getStockEnUso, actualizarStock, entregarSuministros, registrarEntrega, asignarStockCirugia, getStockAsignadoCirugia, agregarStockAdicional, getNotificaciones, marcarNotificacionLeida, registrarEsterilizacion, getHistorialEsterilizacion, getProcedimientosConcurrentes } from '../controllers/suministrosController';

const router = Router();

// ==================== GESTIÓN DE STOCK ====================

/**
 * @route   GET /api/v1/suministros/stock
 * @desc    Obtener todo el stock disponible
 * @access  Central, Farmacia
 * @query   {
 *   tipo?: string (central|farmacia),
 *   categoria?: string,
 *   disponible?: boolean
 * }
 */
router.get('/stock', getStock);

/**
 * @route   GET /api/v1/suministros/stock/en-uso
 * @desc    Obtener stock actualmente en uso
 * @access  Central, Farmacia
 * @query   {
 *   tipo?: string (central|farmacia),
 *   cirugia_id?: number
 * }
 */
router.get('/stock/en-uso', getStockEnUso);

/**
 * @route   PUT /api/v1/suministros/stock/:id
 * @desc    Actualizar cantidad o estado de un item del stock
 * @access  Central, Farmacia
 * @body    {
 *   cantidad?: number,
 *   estado?: string,
 *   ubicacion?: string,
 *   observaciones?: string
 * }
 */
router.put('/stock/:id', actualizarStock);

// ==================== GESTIÓN DE ENTREGAS ====================

/**
 * @route   POST /api/v1/suministros/entregas
 * @desc    Registrar una nueva entrega de suministros
 * @access  Central, Farmacia
 * @body    {
 *   cirugia_id: number,
 *   items: Array<{
 *     item_id: number,
 *     cantidad: number,
 *     tipo: string
 *   }>,
 *   receptor_id: number,
 *   observaciones?: string
 * }
 */
router.post('/entregas', entregarSuministros);

/**
 * @route   POST /api/v1/suministros/entregas/registro
 * @desc    Registrar la recepción de suministros
 * @access  Central, Farmacia
 * @body    {
 *   entrega_id: number,
 *   receptor_id: number,
 *   cirugia_id: number,
 *   confirmacion_items: Array<{
 *     item_id: number,
 *     cantidad_recibida: number,
 *     estado: string
 *   }>
 * }
 */
router.post('/entregas/registro', registrarEntrega);

// ==================== GESTIÓN DE CIRUGÍAS ====================

/**
 * @route   POST /api/v1/suministros/cirugias/:id/stock
 * @desc    Asignar stock necesario para una cirugía
 * @access  Central, Farmacia
 * @body    {
 *   items: Array<{
 *     item_id: number,
 *     cantidad: number,
 *     tipo: string,
 *     observaciones?: string
 *   }>
 * }
 */
router.post('/cirugias/:id/stock', asignarStockCirugia);

/**
 * @route   GET /api/v1/suministros/cirugias/:id/stock
 * @desc    Obtener stock asignado a una cirugía
 * @access  Central, Farmacia
 */
router.get('/cirugias/:id/stock', getStockAsignadoCirugia);

/**
 * @route   POST /api/v1/suministros/cirugias/:id/stock/adicional
 * @desc    Agregar stock adicional a una cirugía en curso
 * @access  Central, Farmacia
 * @body    {
 *   items: Array<{
 *     item_id: number,
 *     cantidad: number,
 *     tipo: string,
 *     urgencia: boolean,
 *     motivo?: string
 *   }>
 * }
 */
router.post('/cirugias/:id/stock/adicional', agregarStockAdicional);

// ==================== NOTIFICACIONES ====================

/**
 * @route   GET /api/v1/suministros/notificaciones
 * @desc    Obtener notificaciones de solicitudes
 * @access  Central, Farmacia
 * @query   {
 *   tipo?: string (central|farmacia),
 *   urgencia?: boolean,
 *   estado?: string,
 *   fecha_inicio?: string,
 *   fecha_fin?: string
 * }
 */
router.get('/notificaciones', getNotificaciones);

/**
 * @route   PUT /api/v1/suministros/notificaciones/:id
 * @desc    Marcar notificación como leída
 * @access  Central, Farmacia
 */
router.put('/notificaciones/:id', marcarNotificacionLeida);

// ==================== ESTERILIZACIÓN (SOLO CENTRAL) ====================

/**
 * @route   POST /api/v1/suministros/central/esterilizacion
 * @desc    Registrar proceso de esterilización
 * @access  Central
 * @body    {
 *   items: Array<{
 *     instrumento_id: number,
 *     cirugia_id?: number,
 *     metodo_esterilizacion: string,
 *     tiempo_esterilizacion: number,
 *     responsable_id: number,
 *     observaciones?: string
 *   }>
 * }
 */
router.post('/central/esterilizacion', registrarEsterilizacion);

/**
 * @route   GET /api/v1/suministros/central/esterilizacion
 * @desc    Obtener historial de esterilización
 * @access  Central
 * @query   {
 *   instrumento_id?: number,
 *   fecha_inicio?: string,
 *   fecha_fin?: string,
 *   cirugia_id?: number
 * }
 */
router.get('/central/esterilizacion', getHistorialEsterilizacion);

// ==================== MONITOREO EN TIEMPO REAL ====================

/**
 * @route   GET /api/v1/suministros/procedimientos-concurrentes
 * @desc    Obtener información de procedimientos en curso
 * @access  Central, Farmacia
 * @query   {
 *   tipo?: string (central|farmacia)
 * }
 */
router.get('/procedimientos-concurrentes', getProcedimientosConcurrentes);

export default router; 