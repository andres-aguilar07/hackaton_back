export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  cedula: string;
  telefono?: string;
  rol_id: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export const validateRegisterData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.nombre || data.nombre.trim().length === 0) {
    errors.push('El nombre es requerido');
  }

  if (!data.apellido || data.apellido.trim().length === 0) {
    errors.push('El apellido es requerido');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email válido es requerido');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (!data.cedula || data.cedula.trim().length === 0) {
    errors.push('La cédula es requerida');
  }

  if (!data.rol_id || !Number.isInteger(data.rol_id)) {
    errors.push('El ID del rol es requerido y debe ser un número');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLoginData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email válido es requerido');
  }

  if (!data.password || data.password.trim().length === 0) {
    errors.push('La contraseña es requerida');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}; 