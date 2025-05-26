# API de Autenticación - Sistema de Gestión Hospitalaria

Esta documentación describe los endpoints de autenticación disponibles en la API.

## Base URL
```
http://localhost:3000/api/v1/auth
```

## Endpoints

### 1. Registrar Usuario
Registra un nuevo usuario en el sistema.

**URL:** `POST /register`
**Acceso:** Público

#### Cuerpo de la Petición
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "password": "mipassword123",
  "cedula": "12345678",
  "telefono": "3001234567",
  "rol_id": 1
}
```

#### Campos Requeridos
- `nombre`: string (máximo 100 caracteres)
- `apellido`: string (máximo 100 caracteres)
- `email`: string válido (máximo 150 caracteres, único)
- `password`: string (mínimo 6 caracteres)
- `cedula`: string (máximo 20 caracteres, único)
- `rol_id`: number (debe existir en la tabla de roles)

#### Campos Opcionales
- `telefono`: string (máximo 20 caracteres)

#### Respuesta Exitosa (201)
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@example.com",
      "cedula": "12345678",
      "telefono": "3001234567",
      "rol_id": 1,
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Errores Posibles
- **400**: Datos de registro inválidos
- **409**: Email o cédula ya registrados
- **500**: Error interno del servidor

---

### 2. Iniciar Sesión
Autentica un usuario y devuelve un token JWT.

**URL:** `POST /login`
**Acceso:** Público

#### Cuerpo de la Petición
```json
{
  "email": "juan.perez@example.com",
  "password": "mipassword123"
}
```

#### Campos Requeridos
- `email`: string válido
- `password`: string

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@example.com",
      "cedula": "12345678",
      "telefono": "3001234567",
      "rol_id": 1,
      "rol": {
        "id": 1,
        "nombre": "Médico",
        "descripcion": "Médico especialista"
      },
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Errores Posibles
- **400**: Datos de login inválidos
- **401**: Credenciales inválidas
- **500**: Error interno del servidor

---

### 3. Obtener Perfil
Obtiene la información del usuario autenticado.

**URL:** `GET /profile`
**Acceso:** Privado (requiere token)

#### Headers Requeridos
```
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@example.com",
      "cedula": "12345678",
      "telefono": "3001234567",
      "rol_id": 1,
      "rol": {
        "id": 1,
        "nombre": "Médico",
        "descripcion": "Médico especialista"
      },
      "activo": true,
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

#### Errores Posibles
- **401**: Token de acceso requerido o usuario no autenticado
- **403**: Token inválido
- **404**: Usuario no encontrado
- **500**: Error interno del servidor

---

## Estructura del Token JWT

El token JWT incluye la siguiente información:
```json
{
  "userId": 1,
  "email": "juan.perez@example.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

- **Expiración**: 24 horas
- **Algoritmo**: HS256

---

## Variables de Entorno

Para el correcto funcionamiento de la autenticación, asegúrate de configurar las siguientes variables de entorno:

```env
JWT_SECRET=tu-clave-secreta-muy-segura
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu-password
DB_NAME=hackaton_bbdd
```

---

## Ejemplos de Uso con cURL

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "password": "mipassword123",
    "cedula": "12345678",
    "telefono": "3001234567",
    "rol_id": 1
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "mipassword123"
  }'
```

### Obtener Perfil
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer tu_token_aqui"
``` 