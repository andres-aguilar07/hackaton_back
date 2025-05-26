import { Router } from 'express';
import { login, register, getProfile } from '../controllers/authController';
import { authenticateToken } from '../helpers/authMiddleware';

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Registrar un nuevo usuario
 * @access Public
 * @body {
 *   nombre: string,
 *   apellido: string,
 *   email: string,
 *   password: string,
 *   cedula: string,
 *   telefono?: string,
 *   rol_id: number
 * }
 */
router.post('/register', register);

/**
 * @route POST /api/v1/auth/login
 * @desc Autenticar usuario y obtener token
 * @access Public
 * @body {
 *   email: string,
 *   password: string
 * }
 */
router.post('/login', login);

/**
 * @route GET /api/v1/auth/profile
 * @desc Obtener perfil del usuario autenticado
 * @access Private
 * @headers Authorization: Bearer <token>
 */
router.get('/profile', authenticateToken, getProfile);

export default router; 