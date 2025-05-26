# API de Enfermera Jefe - Sistema de Gestión Hospitalaria

## Descripción General

La API de Enfermera Jefe permite gestionar completamente las cirugías en el sistema hospitalario. Incluye funcionalidades para crear, editar, eliminar, iniciar y finalizar cirugías, así como asignar personal médico y quirófanos.

**Base URL**: `/api/v1/enfermera_jefe`

---

## 🏥 Gestión de Cirugías

### 1. Crear Nueva Cirugía

Crear una nueva cirugía y asignarla a un quirófano específico.

```http
POST /api/v1/enfermera_jefe/cirugias
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Body:**
```json
{
  "paciente_id": 1,
  "tipo_cirugia_id": 3,
  "quirofano_id": 2,
  "cirujano_principal_id": 5,
  "instrumentador_id": 12,
  "fecha_programada": "2025-01-20T14:30:00.000Z",
  "prioridad": "alta",
  "observaciones_previas": "Paciente con antecedentes de diabetes",
  "diagnostico_preoperatorio": "Apendicitis aguda",
  "personal_auxiliar": [
    {
      "usuario_id": 15,
      "rol_cirugia": "anestesiologo"
    },
    {
      "usuario_id": 18,
      "rol_cirugia": "cirujano_auxiliar"
    },
    {
      "usuario_id": 22,
      "rol_cirugia": "residente"
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Cirugía creada y asignada exitosamente",
  "data": {
    "id": 45,
    "paciente_id": 1,
    "tipo_cirugia_id": 3,
    "quirofano_id": 2,
    "cirujano_principal_id": 5,
    "instrumentador_id": 12,
    "fecha_programada": "2025-01-20T14:30:00.000Z",
    "estado": "programada",
    "prioridad": "alta",
    "observaciones_previas": "Paciente con antecedentes de diabetes",
    "diagnostico_preoperatorio": "Apendicitis aguda",
    "paciente": {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "cedula": "12345678"
    },
    "tipo_cirugia": {
      "id": 3,
      "nombre": "Apendicectomía",
      "categoria": "general"
    },
    "quirofano": {
      "id": 2,
      "nombre": "Quirófano B",
      "estado": "libre"
    },
    "cirujano_principal": {
      "id": 5,
      "nombre": "Dr. García",
      "especialidad": "Cirugía General"
    },
    "personal": [
      {
        "usuario_id": 15,
        "rol_cirugia": "anestesiologo",
        "usuario": {
          "nombre": "Dr. López",
          "apellido": "Anestesiólogo"
        }
      }
    ]
  }
}
```

---

### 2. Obtener Todas las Cirugías

Obtener lista de cirugías con filtros opcionales.

```http
GET /api/v1/enfermera_jefe/cirugias
```

**Query Parameters:**
- `fecha_inicio` (opcional): Fecha de inicio del rango (ISO format)
- `fecha_fin` (opcional): Fecha de fin del rango (ISO format)
- `estado` (opcional): Estado de la cirugía (`programada`, `en_curso`, `finalizada`, etc.)
- `quirofano_id` (opcional): ID del quirófano
- `cirujano_id` (opcional): ID del cirujano principal
- `prioridad` (opcional): Prioridad de la cirugía (`baja`, `media`, `alta`, `urgente`)

**Ejemplos de uso:**
```http
GET /api/v1/enfermera_jefe/cirugias?fecha_inicio=2025-01-20&estado=programada
GET /api/v1/enfermera_jefe/cirugias?quirofano_id=2&prioridad=alta
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cirugías obtenidas exitosamente",
  "data": [
    {
      "id": 45,
      "fecha_programada": "2025-01-20T14:30:00.000Z",
      "estado": "programada",
      "prioridad": "alta",
      "paciente": {
        "nombre": "Juan Pérez"
      },
      "quirofano": {
        "nombre": "Quirófano B"
      },
      "cirujano_principal": {
        "nombre": "Dr. García"
      }
    }
  ]
}
```

---

### 3. Obtener Cirugía por ID

Obtener detalles completos de una cirugía específica.

```http
GET /api/v1/enfermera_jefe/cirugias/{id}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cirugía obtenida exitosamente",
  "data": {
    "id": 45,
    "paciente_id": 1,
    "fecha_programada": "2025-01-20T14:30:00.000Z",
    "fecha_inicio": null,
    "fecha_fin": null,
    "estado": "programada",
    "prioridad": "alta",
    "observaciones_previas": "Paciente con antecedentes de diabetes",
    "observaciones_finales": null,
    "diagnostico_preoperatorio": "Apendicitis aguda",
    "diagnostico_postoperatorio": null,
    "duracion_real_minutos": null,
    "paciente": { /* detalles del paciente */ },
    "quirofano": { /* detalles del quirófano */ },
    "cirujano_principal": { /* detalles del cirujano */ },
    "instrumentador": { /* detalles del instrumentador */ },
    "personal": [ /* personal auxiliar */ ]
  }
}
```

---

### 4. Editar Cirugía

Actualizar una cirugía existente (solo permitido para cirugías no iniciadas).

```http
PUT /api/v1/enfermera_jefe/cirugias/{id}
```

**Body:**
```json
{
  "fecha_programada": "2025-01-21T15:00:00.000Z",
  "quirofano_id": 3,
  "prioridad": "urgente",
  "observaciones_previas": "Actualización: Paciente requiere atención urgente",
  "personal_auxiliar": [
    {
      "usuario_id": 20,
      "rol_cirugia": "anestesiologo"
    }
  ]
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cirugía actualizada exitosamente",
  "data": { /* cirugía actualizada */ }
}
```

---

### 5. Posponer Cirugía

Posponer una cirugía programada con motivo.

```http
PUT /api/v1/enfermera_jefe/cirugias/{id}/posponer
```

**Body:**
```json
{
  "nueva_fecha": "2025-01-22T14:30:00.000Z",
  "motivo": "Emergencia médica en quirófano asignado"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cirugía pospuesta exitosamente",
  "data": {
    "id": 45,
    "estado": "pospuesta",
    "fecha_programada": "2025-01-22T14:30:00.000Z",
    "observaciones_previas": "Paciente con antecedentes de diabetes\n\nCIRUGÍA POSPUESTA: Emergencia médica en quirófano asignado"
  }
}
```

---

### 6. Cancelar Cirugía

Cancelar una cirugía (marca como cancelada sin eliminar).

```http
DELETE /api/v1/enfermera_jefe/cirugias/{id}
```

**Body:**
```json
{
  "motivo": "Paciente no se presentó para la cirugía"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cirugía cancelada exitosamente"
}
```

---

## 🚀 Control de Estado de Cirugías

### 7. Iniciar Cirugía

Cambiar el estado de una cirugía a "en curso" y registrar hora de inicio.

```http
PUT /api/v1/enfermera_jefe/cirugias/{id}/iniciar
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cirugía iniciada exitosamente",
  "data": {
    "id": 45,
    "estado": "en_curso",
    "fecha_inicio": "2025-01-20T14:35:00.000Z"
  }
}
```

---

### 8. Finalizar Cirugía

Finalizar una cirugía en curso y añadir observaciones del personal médico.

```http
PUT /api/v1/enfermera_jefe/cirugias/{id}/finalizar
```

**Body:**
```json
{
  "observaciones_finales": "Cirugía completada sin complicaciones",
  "diagnostico_postoperatorio": "Apendicectomía exitosa, paciente estable",
  "observaciones_cirujano": "Procedimiento estándar, sin hallazgos inusuales",
  "observaciones_anestesiologo": "Anestesia general sin complicaciones, despertar normal"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Cirugía finalizada exitosamente",
  "data": {
    "id": 45,
    "estado": "finalizada",
    "fecha_fin": "2025-01-20T16:15:00.000Z",
    "duracion_real_minutos": 100,
    "observaciones_finales": "OBSERVACIONES GENERALES:\nCirugía completada sin complicaciones\n\nOBSERVACIONES DEL CIRUJANO:\nProcedimiento estándar, sin hallazgos inusuales\n\nOBSERVACIONES DEL ANESTESIÓLOGO:\nAnestesia general sin complicaciones, despertar normal",
    "diagnostico_postoperatorio": "Apendicectomía exitosa, paciente estable"
  }
}
```

---

## 👥 Gestión de Recursos

### 9. Obtener Personal Disponible

Consultar personal médico disponible para asignar a cirugías.

```http
GET /api/v1/enfermera_jefe/personal-disponible
```

**Query Parameters:**
- `tipo_personal` (opcional): Tipo de personal (`cirujanos`, `instrumentadores`, `anestesiologos`, `auxiliares`)
- `fecha` (opcional): Fecha para verificar disponibilidad

**Ejemplos:**
```http
GET /api/v1/enfermera_jefe/personal-disponible?tipo_personal=cirujanos
GET /api/v1/enfermera_jefe/personal-disponible?tipo_personal=anestesiologos&fecha=2025-01-20
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Personal disponible obtenido exitosamente",
  "data": [
    {
      "id": 15,
      "nombre": "Dr. López",
      "apellido": "Anestesiólogo",
      "cedula": "87654321",
      "rol": {
        "nombre": "anestesiologo"
      }
    }
  ]
}
```

---

### 10. Obtener Quirófanos Disponibles

Consultar quirófanos disponibles para una fecha y hora específica.

```http
GET /api/v1/enfermera_jefe/quirofanos-disponibles
```

**Query Parameters (Requeridos):**
- `fecha`: Fecha en formato YYYY-MM-DD
- `hora`: Hora en formato HH:MM

**Ejemplo:**
```http
GET /api/v1/enfermera_jefe/quirofanos-disponibles?fecha=2025-01-20&hora=14:30
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Quirófanos disponibles obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Quirófano A",
      "ubicacion": "Planta 2",
      "estado": "libre",
      "categoria_quirofano": {
        "nombre": "General"
      }
    },
    {
      "id": 3,
      "nombre": "Quirófano C",
      "ubicacion": "Planta 2",
      "estado": "libre",
      "categoria_quirofano": {
        "nombre": "Cardiovascular"
      }
    }
  ]
}
```

---

## 📋 Estados de Cirugía

Las cirugías pueden tener los siguientes estados:

- **`programada`**: Cirugía planificada pero no iniciada
- **`en_preparacion`**: Quirófano siendo preparado
- **`conteo_inicial`**: Realizando conteo inicial de instrumentos
- **`en_curso`**: Cirugía en progreso
- **`conteo_final`**: Realizando conteo final de instrumentos
- **`finalizada`**: Cirugía completada
- **`cancelada`**: Cirugía cancelada
- **`pospuesta`**: Cirugía pospuesta para otra fecha

## 🎯 Roles de Personal en Cirugía

- **`cirujano_auxiliar`**: Cirujano de apoyo
- **`anestesiologo`**: Responsable de la anestesia
- **`residente`**: Médico en formación
- **`observador`**: Personal en observación/aprendizaje

## 🚨 Prioridades de Cirugía

- **`baja`**: Cirugía electiva, no urgente
- **`media`**: Cirugía programada estándar
- **`alta`**: Cirugía importante, prioridad elevada
- **`urgente`**: Cirugía de emergencia

---

## ⚠️ Códigos de Error Comunes

### 400 - Bad Request
```json
{
  "success": false,
  "message": "No se puede editar una cirugía en curso o finalizada"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Cirugía no encontrada"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "El quirófano no está disponible en el horario solicitado"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```

---

## 💡 Notas Importantes

1. **Verificación de Disponibilidad**: El sistema verifica automáticamente la disponibilidad de quirófanos con un margen de ±2 horas.

2. **Estados Inmutables**: No se pueden editar cirugías en estado `en_curso` o `finalizada`.

3. **Personal Auxiliar**: El array de personal auxiliar se reemplaza completamente en cada actualización.

4. **Observaciones Múltiples**: Al finalizar una cirugía, se pueden agregar observaciones separadas por tipo de personal médico.

5. **Duración Automática**: La duración de la cirugía se calcula automáticamente basada en las fechas de inicio y fin.

6. **Soft Delete**: Las cirugías canceladas no se eliminan físicamente, solo se marcan como canceladas.

---

Esta documentación cubre todas las funcionalidades principales de la API de Enfermera Jefe. Para más detalles sobre autenticación y autorización, consultar la documentación general de la API. 