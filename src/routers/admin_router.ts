import { Router } from 'express';
import {
  // Gestión de usuarios
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllRoles,
  
  // Gestión de pacientes
  registerPatient,
  getAllPatients,
  
  // Gestión de quirófanos
  createQuirofano,
  getAllQuirofanos,
  updateQuirofano,
  getCategoriaQuirofanos,
  
  // Gestión de entidades suministradoras
  createEntidadSuministradora,
  getAllEntidadesSuministradoras,
  
  // Gestión de estándares de cirugía
  createTipoCirugia,
  getAllTiposCirugia,
  
  // Informes de cirugía
  getCirugiaReport,
  getAllCirugias,
  
  // Estadísticas
  getEstadisticas
} from '../controllers/adminController';

const router = Router();

// ==================== RUTAS DE GESTIÓN DE USUARIOS ====================

// Registrar nuevo usuario (médico, instrumentador, enfermera jefe, etc.)
router.post('/users', registerUser);

// Obtener todos los usuarios
router.get('/users', getAllUsers);

// Actualizar un usuario específico (incluye asignar rol)
router.put('/users/:id', updateUser);

// Eliminar un usuario
router.delete('/users/:id', deleteUser);

// Obtener todos los roles disponibles
router.get('/roles', getAllRoles);

// ==================== RUTAS DE GESTIÓN DE PACIENTES ====================

// Registrar nuevo paciente
router.post('/patients', registerPatient);

// Obtener todos los pacientes
router.get('/patients', getAllPatients);

// ==================== RUTAS DE GESTIÓN DE QUIRÓFANOS ====================

// Crear nuevo quirófano
router.post('/quirofanos', createQuirofano);

// Obtener todos los quirófanos
router.get('/quirofanos', getAllQuirofanos);

// Actualizar quirófano (editar dentro de una categoría)
router.put('/quirofanos/:id', updateQuirofano);

// Obtener categorías de quirófanos
router.get('/quirofanos/categorias', getCategoriaQuirofanos);

// ==================== RUTAS DE ENTIDADES SUMINISTRADORAS ====================

// Crear nueva entidad suministradora
router.post('/entidades-suministradoras', createEntidadSuministradora);

// Obtener todas las entidades suministradoras
router.get('/entidades-suministradoras', getAllEntidadesSuministradoras);

// ==================== RUTAS DE ESTÁNDARES DE CIRUGÍA ====================

// Crear estándar para cirugía específica
router.post('/tipos-cirugia', createTipoCirugia);

// Obtener todos los tipos/estándares de cirugía
router.get('/tipos-cirugia', getAllTiposCirugia);

// ==================== RUTAS DE INFORMES ====================

// Obtener informe detallado de una cirugía específica para PDF
// Incluye: todo lo solicitado y usado, instrumentos contados, instrumentador, cirujano
router.get('/reports/cirugia/:id', getCirugiaReport);

// Obtener todas las cirugías con filtros opcionales
// Query params: fecha_inicio, fecha_fin, estado, cirujano_id
router.get('/reports/cirugias', getAllCirugias);

// ==================== RUTAS DE ESTADÍSTICAS (OPCIONAL) ====================

// Panel de estadísticas
// - Cirugías promedio por día
// - Cirugías en curso
// - Casos graves (incidentes)
// - Contadores generales
router.get('/estadisticas', getEstadisticas);

export default router;
