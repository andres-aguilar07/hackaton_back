# 👩‍⚕️ Guía Completa del Módulo Enfermera Jefe

## 📋 Resumen Ejecutivo

El módulo de Enfermera Jefe es el núcleo operacional del Sistema de Gestión Hospitalaria, proporcionando control completo sobre la programación, ejecución y seguimiento de cirugías. Este módulo permite gestionar eficientemente los recursos quirúrgicos, asignar personal médico y mantener un registro detallado de todas las operaciones.

## 🎯 Funcionalidades Implementadas

### ✅ **1. Gestión Completa de Cirugías**
- **Crear**: Programar nuevas cirugías con verificación automática de disponibilidad
- **Editar**: Modificar detalles de cirugías no iniciadas
- **Posponer**: Cambiar fechas con registro de motivos
- **Cancelar**: Cancelación con registro de causas (soft delete)
- **Listar**: Obtener cirugías con múltiples filtros

### ✅ **2. Control de Estados de Cirugía**
- **Iniciar**: Marcar inicio de cirugía y registrar hora real
- **Finalizar**: Completar cirugía con observaciones detalladas
- **Estados**: `programada` → `en_preparacion` → `en_curso` → `finalizada`

### ✅ **3. Asignación de Personal Médico**
- **Cirujano Principal**: Responsable de la operación
- **Personal Auxiliar**: Cirujanos auxiliares, anestesiólogos, residentes
- **Instrumentador**: Especialista en instrumentos quirúrgicos
- **Verificación**: Control de disponibilidad por fecha/hora

### ✅ **4. Gestión de Recursos**
- **Quirófanos**: Verificación de disponibilidad con margen de ±2 horas
- **Personal**: Consulta de disponibilidad por especialidad
- **Conflictos**: Prevención automática de solapamientos

### ✅ **5. Sistema de Observaciones**
- **Observaciones Generales**: Notas del procedimiento
- **Por Especialidad**: Observaciones específicas de cada tipo de personal
- **Diagnósticos**: Pre y post operatorios

## 🏗️ Arquitectura Técnica

### **Controller** (`src/controllers/enfermeraJefeController.ts`)
```
- createCirugia()          → Crear cirugía con validaciones
- getAllCirugias()         → Listar con filtros avanzados
- getCirugiaById()         → Detalles completos de cirugía
- updateCirugia()          → Editar cirugía (estados permitidos)
- posponerCirugia()        → Posponer con nueva fecha/motivo
- deleteCirugia()          → Cancelar con motivo (soft delete)
- iniciarCirugia()         → Cambiar estado a EN_CURSO
- finalizarCirugia()       → Finalizar con observaciones
- getPersonalDisponible()  → Consultar personal por tipo
- getQuirofanosDisponibles() → Verificar quirófanos libres
```

### **Router** (`src/routers/enfermeraJefeRouter.ts`)
```
POST   /cirugias                    → Crear cirugía
GET    /cirugias                    → Listar cirugías (con filtros)
GET    /cirugias/:id                → Obtener cirugía específica
PUT    /cirugias/:id                → Editar cirugía
PUT    /cirugias/:id/posponer       → Posponer cirugía
DELETE /cirugias/:id                → Cancelar cirugía
PUT    /cirugias/:id/iniciar        → Iniciar cirugía
PUT    /cirugias/:id/finalizar      → Finalizar cirugía
GET    /personal-disponible         → Consultar personal
GET    /quirofanos-disponibles      → Consultar quirófanos
```

### **Modelos de Datos**
- `Cirugia`: Entidad principal con todos los detalles
- `CirugiaPersonal`: Relación many-to-many para asignaciones
- `Paciente`, `TipoCirugia`, `Quirofano`, `Medico`: Entidades relacionadas

## 🔧 Uso Práctico

### **1. Flujo Típico de Creación de Cirugía**

```javascript
// Paso 1: Verificar disponibilidad de quirófanos
const quirofanos = await fetch('/api/v1/enfermera_jefe/quirofanos-disponibles?fecha=2025-01-20&hora=14:30');

// Paso 2: Consultar personal disponible
const cirujanos = await fetch('/api/v1/enfermera_jefe/personal-disponible?tipo_personal=cirujanos');

// Paso 3: Crear la cirugía
const nuevaCirugia = await fetch('/api/v1/enfermera_jefe/cirugias', {
  method: 'POST',
  body: JSON.stringify({
    paciente_id: 1,
    tipo_cirugia_id: 3,
    quirofano_id: 2,
    cirujano_principal_id: 5,
    fecha_programada: "2025-01-20T14:30:00.000Z",
    prioridad: "alta",
    personal_auxiliar: [
      { medico_id: 15, rol_en_cirugia: "anestesiologo" },
      { medico_id: 18, rol_en_cirugia: "cirujano_auxiliar" }
    ]
  })
});
```

### **2. Gestión de Estados**

```javascript
// Iniciar cirugía
await fetch(`/api/v1/enfermera_jefe/cirugias/${id}/iniciar`, { method: 'PUT' });

// Finalizar con observaciones
await fetch(`/api/v1/enfermera_jefe/cirugias/${id}/finalizar`, {
  method: 'PUT',
  body: JSON.stringify({
    observaciones_finales: "Cirugía exitosa sin complicaciones",
    diagnostico_postoperatorio: "Paciente estable",
    observaciones_cirujano: "Procedimiento estándar",
    observaciones_anestesiologo: "Anestesia sin incidentes"
  })
});
```

### **3. Consultas con Filtros**

```javascript
// Cirugías del día con alta prioridad
const urgentes = await fetch('/api/v1/enfermera_jefe/cirugias?fecha_inicio=2025-01-20&prioridad=alta');

// Cirugías de un quirófano específico
const quirofano2 = await fetch('/api/v1/enfermera_jefe/cirugias?quirofano_id=2');

// Cirugías de un cirujano en rango de fechas
const drGarcia = await fetch('/api/v1/enfermera_jefe/cirugias?cirujano_id=5&fecha_inicio=2025-01-15&fecha_fin=2025-01-25');
```

## 🔒 Validaciones de Negocio Implementadas

### **1. Verificación de Disponibilidad**
- Quirófanos: Margen de ±2 horas para evitar conflictos
- Personal: Verificación por fecha y especialidad
- Estados: Control de transiciones válidas

### **2. Reglas de Estado**
- Solo cirugías `programadas` o `en_preparacion` pueden iniciarse
- Solo cirugías `en_curso` pueden finalizarse
- Cirugías `en_curso` o `finalizada` no pueden editarse

### **3. Integridad de Datos**
- Verificación de existencia de entidades relacionadas
- Validación de roles de personal en cirugías
- Control de fechas lógicas (no en el pasado)

## 📊 Monitoreo y Reportes

### **Estados Disponibles**
- `programada`: Cirugía agendada
- `en_preparacion`: Preparando quirófano
- `conteo_inicial`: Contando instrumentos
- `en_curso`: Operación en progreso
- `conteo_final`: Verificando instrumentos
- `finalizada`: Completada exitosamente
- `pospuesta`: Reagendada
- `cancelada`: Cancelada por motivos médicos/administrativos

### **Prioridades**
- `baja`: Procedimientos programables
- `media`: Cirugías estándar
- `alta`: Casos importantes
- `urgente`: Emergencias médicas

### **Roles de Personal**
- `cirujano_auxiliar`: Apoyo quirúrgico
- `anestesiologo`: Manejo de anestesia
- `residente`: Personal en formación
- `observador`: Personal en aprendizaje

## 🔍 Testing y Verificación

Se incluye un script de prueba completo (`test_enfermera_jefe.js`) que verifica:

1. ✅ Autenticación de enfermera jefe
2. ✅ Consulta de recursos disponibles
3. ✅ Creación de cirugías con personal
4. ✅ Listado y filtrado de cirugías
5. ✅ Gestión de estados (iniciar/finalizar)
6. ✅ Agregación de observaciones

## 📚 Documentación de Referencia

- **[API Reference](api/enfermera-jefe.md)**: Documentación completa de endpoints
- **[README General](README.md)**: Arquitectura del sistema completo
- **[Test Script](../test_enfermera_jefe.js)**: Ejemplos prácticos de uso

## 🚀 Próximos Pasos Sugeridos

1. **Implementar Notificaciones**: Alertas automáticas para cambios de estado
2. **Dashboard en Tiempo Real**: Visualización del estado de quirófanos
3. **Reportes Avanzados**: Estadísticas de tiempos y eficiencia
4. **Integración con Inventario**: Control automático de instrumentos
5. **Mobile App**: Aplicación móvil para seguimiento en tiempo real

---

**✨ El módulo de Enfermera Jefe está completamente implementado y listo para uso en producción, proporcionando todas las funcionalidades requeridas para la gestión eficiente de cirugías hospitalarias.** 