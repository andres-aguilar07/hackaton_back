# API Administrativa - Documentación

Esta documentación describe todos los endpoints disponibles para el panel administrativo del Sistema de Gestión Hospitalaria.

**Base URL:** `http://localhost:3000/api/v1/admin`

## 📋 Índice

1. [Gestión de Usuarios](#gestión-de-usuarios)
2. [Gestión de Pacientes](#gestión-de-pacientes)
3. [Gestión de Quirófanos](#gestión-de-quirófanos)
4. [Gestión de Entidades Suministradoras](#gestión-de-entidades-suministradoras)
5. [Gestión de Estándares de Cirugía](#gestión-de-estándares-de-cirugía)
6. [Informes de Cirugía](#informes-de-cirugía)
7. [Estadísticas](#estadísticas)

---

## 👥 Gestión de Usuarios

### Registrar Usuario (Médico, Instrumentador, Enfermera Jefe, etc.)

**POST** `/users`

```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "email": "jperez@hospital.com",
  "password": "password123",
  "cedula": "12345678",
  "telefono": "3001234567",
  "rol_id": 2
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "email": "jperez@hospital.com",
    "cedula": "12345678",
    "telefono": "3001234567",
    "rol_id": 2,
    "activo": true
  }
}
```

### Obtener Todos los Usuarios

**GET** `/users`

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Juan Carlos",
      "apellido": "Pérez García",
      "email": "jperez@hospital.com",
      "cedula": "12345678",
      "telefono": "3001234567",
      "rol_id": 2,
      "activo": true,
      "rol": {
        "id": 2,
        "nombre": "Médico",
        "descripcion": "Médico especialista"
      }
    }
  ]
}
```

### Actualizar Usuario

**PUT** `/users/:id`

```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "email": "jperez@hospital.com",
  "cedula": "12345678",
  "telefono": "3001234567",
  "rol_id": 3,
  "activo": true
}
```

### Eliminar Usuario

**DELETE** `/users/:id`

### Obtener Todos los Roles

**GET** `/roles`

**Respuesta:**
```json
{
  "success": true,
  "message": "Roles obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Administrador",
      "descripcion": "Administrador del sistema"
    },
    {
      "id": 2,
      "nombre": "Médico",
      "descripcion": "Médico especialista"
    },
    {
      "id": 3,
      "nombre": "Instrumentador",
      "descripcion": "Instrumentador quirúrgico"
    },
    {
      "id": 4,
      "nombre": "Enfermera Jefe",
      "descripcion": "Enfermera jefe de quirófano"
    }
  ]
}
```

---

## 🏥 Gestión de Pacientes

### Registrar Paciente

**POST** `/patients`

```json
{
  "nombre": "María",
  "apellido": "González",
  "cedula": "87654321",
  "fecha_nacimiento": "1985-03-15",
  "telefono": "3009876543",
  "direccion": "Calle 123 #45-67",
  "tipo_sangre": "O+",
  "alergias": "Penicilina",
  "condiciones_medicas": "Hipertensión",
  "contacto_emergencia_nombre": "Carlos González",
  "contacto_emergencia_telefono": "3001111111"
}
```

### Obtener Todos los Pacientes

**GET** `/patients`

### Actualizar Paciente

**PUT** `/patients/:id`

```json
{
  "nombre": "María Elena",
  "apellido": "González Pérez",
  "cedula": "87654321",
  "fecha_nacimiento": "1985-03-15",
  "telefono": "3009876543",
  "direccion": "Calle 123 #45-67, Apt 101",
  "tipo_sangre": "O+",
  "alergias": "Penicilina, Látex",
  "condiciones_medicas": "Hipertensión controlada, Diabetes tipo 2",
  "contacto_emergencia_nombre": "Carlos González",
  "contacto_emergencia_telefono": "3001111111"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Paciente actualizado exitosamente",
  "data": {
    "id": 1,
    "nombre": "María Elena",
    "apellido": "González Pérez",
    "cedula": "87654321",
    "fecha_nacimiento": "1985-03-15",
    "telefono": "3009876543",
    "direccion": "Calle 123 #45-67, Apt 101",
    "tipo_sangre": "O+",
    "alergias": "Penicilina, Látex",
    "condiciones_medicas": "Hipertensión controlada, Diabetes tipo 2",
    "contacto_emergencia_nombre": "Carlos González",
    "contacto_emergencia_telefono": "3001111111",
    "created_at": "2024-01-10T10:30:00.000Z",
    "updated_at": "2024-01-15T14:20:00.000Z"
  }
}
```

---

## 🏢 Gestión de Quirófanos

### Crear Quirófano

**POST** `/quirofanos`

```json
{
  "nombre": "Quirófano Central 1",
  "numero": 1,
  "categoria_id": 1,
  "capacidad_personas": 8,
  "equipamiento_especial": "Láser, Microscopio quirúrgico",
  "ubicacion": "Piso 3, Ala Norte"
}
```

### Obtener Todos los Quirófanos

**GET** `/quirofanos`

### Actualizar Quirófano

**PUT** `/quirofanos/:id`

```json
{
  "nombre": "Quirófano Central 1 - Actualizado",
  "categoria_id": 2,
  "capacidad_personas": 10,
  "equipamiento_especial": "Láser, Microscopio quirúrgico, Robot Da Vinci",
  "ubicacion": "Piso 3, Ala Norte",
  "activo": true
}
```

### Obtener Categorías de Quirófanos

**GET** `/quirofanos/categorias`

---

## 🚛 Gestión de Entidades Suministradoras

### Crear Entidad Suministradora

**POST** `/entidades-suministradoras`

```json
{
  "nombre": "Suministros Médicos ABC",
  "tipo": "PROVEEDOR_EXTERNO",
  "ubicacion": "Zona Industrial Norte",
  "telefono": "3015555555",
  "responsable_id": 1
}
```

### Obtener Todas las Entidades Suministradoras

**GET** `/entidades-suministradoras`

---

## ⚕️ Gestión de Estándares de Cirugía

### Crear Estándar de Cirugía

**POST** `/tipos-cirugia`

```json
{
  "nombre": "Apendicectomía Laparoscópica",
  "descripcion": "Extirpación del apéndice mediante cirugía mínimamente invasiva",
  "duracion_estimada_minutos": 90,
  "nivel_complejidad": "MEDIA"
}
```

### Obtener Todos los Tipos de Cirugía

**GET** `/tipos-cirugia`

---

## 📊 Informes de Cirugía

### Obtener Informe Detallado de Cirugía

**GET** `/reports/cirugia/:id`

Este endpoint devuelve un informe completo de una cirugía específica que incluye:
- Información del paciente
- Tipo de cirugía realizada
- Quirófano utilizado
- Cirujano principal e instrumentador
- Personal asignado
- Stock/instrumentos utilizados
- Conteos de instrumentación realizados
- Detalles de conteo antes y después

**Respuesta:**
```json
{
  "success": true,
  "message": "Informe de cirugía obtenido exitosamente",
  "data": {
    "id": 1,
    "fecha_programada": "2024-01-15T08:00:00.000Z",
    "fecha_inicio": "2024-01-15T08:15:00.000Z",
    "fecha_fin": "2024-01-15T10:30:00.000Z",
    "estado": "COMPLETADA",
    "duracion_real_minutos": 135,
    "paciente": {
      "nombre": "María",
      "apellido": "González",
      "cedula": "87654321"
    },
    "tipo_cirugia": {
      "nombre": "Apendicectomía Laparoscópica",
      "nivel_complejidad": "MEDIA"
    },
    "quirofano": {
      "nombre": "Quirófano Central 1",
      "numero": 1
    },
    "cirujano_principal": {
      "nombre": "Dr. Carlos",
      "apellido": "Rodríguez"
    },
    "instrumentador": {
      "nombre": "Ana",
      "apellido": "López"
    },
    "stock_asignado": [
      {
        "cantidad_solicitada": 5,
        "cantidad_utilizada": 4,
        "stock": {
          "nombre": "Bisturí Desechable #15"
        }
      }
    ],
    "conteos": [
      {
        "tipo_conteo": "PRE_OPERATORIO",
        "realizado_por_id": 3,
        "detalles": [
          {
            "item_nombre": "Gasas 4x4",
            "cantidad_inicial": 20,
            "cantidad_final": 20,
            "diferencia": 0,
            "observaciones": "Conteo correcto"
          }
        ]
      }
    ]
  }
}
```

### Obtener Todas las Cirugías con Filtros

**GET** `/reports/cirugias`

**Query Parameters:**
- `fecha_inicio`: Fecha de inicio (YYYY-MM-DD)
- `fecha_fin`: Fecha de fin (YYYY-MM-DD)
- `estado`: Estado de la cirugía (PROGRAMADA, EN_CURSO, COMPLETADA, etc.)
- `cirujano_id`: ID del cirujano principal

**Ejemplo:**
```
GET /reports/cirugias?fecha_inicio=2024-01-01&fecha_fin=2024-01-31&estado=COMPLETADA
```

---

## 📈 Estadísticas

### Obtener Panel de Estadísticas

**GET** `/estadisticas`

**Respuesta:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "cirugias_dia": 8,
    "cirugias_en_curso": 3,
    "incidentes_mes": 2,
    "promedio_cirugias_dia": 12.5,
    "quirofanos_activos": 6,
    "usuarios_por_rol": [
      {
        "rol_id": 1,
        "count": 2,
        "rol": {
          "nombre": "Administrador"
        }
      },
      {
        "rol_id": 2,
        "count": 15,
        "rol": {
          "nombre": "Médico"
        }
      },
      {
        "rol_id": 3,
        "count": 8,
        "rol": {
          "nombre": "Instrumentador"
        }
      }
    ]
  }
}
```

---

## 🚀 Ejemplos de Uso

### Flujo Completo: Registrar Personal Médico

1. **Obtener roles disponibles:**
   ```bash
   GET /api/v1/admin/roles
   ```

2. **Registrar médico:**
   ```bash
   POST /api/v1/admin/users
   Content-Type: application/json
   
   {
     "nombre": "Dr. Carlos",
     "apellido": "Rodríguez",
     "email": "crodriguez@hospital.com",
     "password": "medico123",
     "cedula": "11223344",
     "telefono": "3007777777",
     "rol_id": 2
   }
   ```

3. **Verificar registro:**
   ```bash
   GET /api/v1/admin/users
   ```

### Flujo Completo: Configurar Quirófano

1. **Ver categorías disponibles:**
   ```bash
   GET /api/v1/admin/quirofanos/categorias
   ```

2. **Crear quirófano:**
   ```bash
   POST /api/v1/admin/quirofanos
   Content-Type: application/json
   
   {
     "nombre": "Quirófano Cardiovascular",
     "numero": 5,
     "categoria_id": 2,
     "capacidad_personas": 12,
     "equipamiento_especial": "Bomba de circulación extracorpórea, Monitor multiparamétrico",
     "ubicacion": "Piso 4, Ala Cardiovascular"
   }
   ```

### Generar Informe de Cirugía para PDF

```bash
GET /api/v1/admin/reports/cirugia/1
```

Este endpoint devuelve toda la información necesaria para generar un PDF con:
- ✅ Todo lo que se pidió y se usó durante la cirugía
- ✅ Todos los instrumentos utilizados y contados correctamente antes y después
- ✅ Instrumentador y cirujano a cargo
- ✅ Información detallada del paciente y tipo de cirugía

---

## 🔧 Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en los datos enviados
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: email o cédula ya existe)
- **500**: Error interno del servidor

---

## 💡 Notas Importantes

1. **Sin autenticación por token**: Como solicitaste, ninguna ruta requiere autenticación por token.

2. **Validaciones automáticas**: 
   - Emails y cédulas únicas
   - Verificación de existencia de roles, categorías, etc.
   - Validación de tipos de datos

3. **Soft Delete**: Los registros no se eliminan físicamente, se marcan como eliminados (`deleted_at`).

4. **Informes completos**: El endpoint de informes incluye toda la información necesaria para generar PDFs detallados.

5. **Estadísticas en tiempo real**: Las estadísticas se calculan en tiempo real basadas en los datos actuales.

6. **Filtros flexibles**: Los endpoints de listado incluyen filtros opcionales para facilitar la búsqueda. 