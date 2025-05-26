import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import Role from '../models/Role';
import { hashPassword, comparePassword, generateToken } from '../helpers/auth';
import { validateRegisterData, validateLoginData, RegisterData, LoginData } from '../helpers/validations';
import { AuthenticatedRequest } from '../helpers/authMiddleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const registerData: RegisterData = req.body;
    
    // Validar datos de entrada
    const validation = validateRegisterData(registerData);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Datos de registro inválidos',
        errors: validation.errors
      });
      return;
    }

    // Verificar si el email ya existe
    const existingUserByEmail = await Usuario.findOne({
      where: { email: registerData.email }
    });

    if (existingUserByEmail) {
      res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
      return;
    }

    // Verificar si la cédula ya existe
    const existingUserByCedula = await Usuario.findOne({
      where: { cedula: registerData.cedula }
    });

    if (existingUserByCedula) {
      res.status(409).json({
        success: false,
        message: 'La cédula ya está registrada'
      });
      return;
    }

    // Verificar que el rol existe
    const role = await Role.findByPk(registerData.rol_id);
    if (!role) {
      res.status(400).json({
        success: false,
        message: 'El rol especificado no existe'
      });
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(registerData.password);

    // Crear usuario
    const newUser = await Usuario.create({
      nombre: registerData.nombre,
      apellido: registerData.apellido,
      email: registerData.email,
      password_hash: hashedPassword,
      cedula: registerData.cedula,
      telefono: registerData.telefono,
      rol_id: registerData.rol_id,
      activo: true
    });

    // Generar token
    const token = generateToken(newUser.id, newUser.email);

    // Responder sin incluir el hash de la contraseña
    const userResponse = {
      id: newUser.id,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      email: newUser.email,
      cedula: newUser.cedula,
      telefono: newUser.telefono,
      rol_id: newUser.rol_id,
      activo: newUser.activo
    };

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData: LoginData = req.body;

    // Validar datos de entrada
    const validation = validateLoginData(loginData);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Datos de login inválidos',
        errors: validation.errors
      });
      return;
    }

    // Buscar usuario por email e incluir el rol
    const user = await Usuario.findOne({
      where: { 
        email: loginData.email,
        activo: true 
      },
      include: [{
        model: Role,
        as: 'rol'
      }]
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(loginData.password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    // Generar token
    const token = generateToken(user.id, user.email);

    // Responder con datos del usuario y token
    const userResponse = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      cedula: user.cedula,
      telefono: user.telefono,
      rol_id: user.rol_id,
      rol: user.rol,
      activo: user.activo
    };

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Buscar usuario por ID e incluir el rol
    const user = await Usuario.findByPk(req.user.userId, {
      include: [{
        model: Role,
        as: 'rol'
      }],
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 