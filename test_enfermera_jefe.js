// Script de prueba para verificar las rutas de Enfermera Jefe
// Este script demuestra cómo usar la API completa

const baseURL = 'http://localhost:3000/api/v1';

// Función auxiliar para hacer requests
async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseURL}${endpoint}`, config);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Error en request:', error);
    return { status: 500, data: { error: error.message } };
  }
}

// ==================== PRUEBAS DE ENFERMERA JEFE ====================

async function testEnfermeraJefeAPI() {
  console.log('🏥 === PRUEBAS DE API ENFERMERA JEFE ===\n');

  let token = null;

  // 1. Autenticación (necesaria para todas las operaciones)
  console.log('1. 🔐 Probando autenticación...');
  const loginResult = await apiRequest('/auth/login', 'POST', {
    email: 'enfermera.jefe@hospital.com',
    password: 'password123'
  });
  
  if (loginResult.status === 200) {
    token = loginResult.data.token;
    console.log('   ✅ Login exitoso');
  } else {
    console.log('   ❌ Error en login:', loginResult.data.message);
    return;
  }

  // 2. Consultar quirófanos disponibles
  console.log('\n2. 🏠 Consultando quirófanos disponibles...');
  const quirofanosResult = await apiRequest(
    '/enfermera_jefe/quirofanos-disponibles?fecha=2025-01-20&hora=14:30',
    'GET',
    null,
    token
  );
  console.log(`   Status: ${quirofanosResult.status}`);
  if (quirofanosResult.data.success) {
    console.log(`   ✅ ${quirofanosResult.data.data.length} quirófanos disponibles`);
  }

  // 3. Consultar personal disponible
  console.log('\n3. 👥 Consultando personal disponible...');
  const personalResult = await apiRequest(
    '/enfermera_jefe/personal-disponible?tipo_personal=cirujanos',
    'GET',
    null,
    token
  );
  console.log(`   Status: ${personalResult.status}`);
  if (personalResult.data.success) {
    console.log(`   ✅ ${personalResult.data.data.length} cirujanos disponibles`);
  }

  // 4. Crear una nueva cirugía
  console.log('\n4. ➕ Creando nueva cirugía...');
  const nuevaCirugiaData = {
    paciente_id: 1,
    tipo_cirugia_id: 1,
    quirofano_id: 1,
    cirujano_principal_id: 1,
    instrumentador_id: 2,
    fecha_programada: "2025-01-20T14:30:00.000Z",
    prioridad: "alta",
    observaciones_previas: "Paciente con antecedentes de diabetes",
    diagnostico_preoperatorio: "Apendicitis aguda",
    personal_auxiliar: [
      {
        medico_id: 3,
        rol_en_cirugia: "anestesiologo"
      },
      {
        medico_id: 4,
        rol_en_cirugia: "cirujano_auxiliar"
      }
    ]
  };

  const createResult = await apiRequest(
    '/enfermera_jefe/cirugias',
    'POST',
    nuevaCirugiaData,
    token
  );
  console.log(`   Status: ${createResult.status}`);
  
  let cirugiaId = null;
  if (createResult.data.success) {
    cirugiaId = createResult.data.data.id;
    console.log(`   ✅ Cirugía creada con ID: ${cirugiaId}`);
  } else {
    console.log(`   ⚠️ Error o advertencia: ${createResult.data.message}`);
  }

  // 5. Obtener todas las cirugías
  console.log('\n5. 📋 Obteniendo lista de cirugías...');
  const listaResult = await apiRequest(
    '/enfermera_jefe/cirugias?fecha_inicio=2025-01-15',
    'GET',
    null,
    token
  );
  console.log(`   Status: ${listaResult.status}`);
  if (listaResult.data.success) {
    console.log(`   ✅ ${listaResult.data.data.length} cirugías encontradas`);
  }

  // 6. Obtener cirugía específica (si se creó una)
  if (cirugiaId) {
    console.log(`\n6. 🔍 Obteniendo detalles de cirugía ${cirugiaId}...`);
    const detalleResult = await apiRequest(
      `/enfermera_jefe/cirugias/${cirugiaId}`,
      'GET',
      null,
      token
    );
    console.log(`   Status: ${detalleResult.status}`);
    if (detalleResult.data.success) {
      console.log(`   ✅ Cirugía obtenida - Estado: ${detalleResult.data.data.estado}`);
    }

    // 7. Iniciar cirugía
    console.log(`\n7. ▶️ Iniciando cirugía ${cirugiaId}...`);
    const iniciarResult = await apiRequest(
      `/enfermera_jefe/cirugias/${cirugiaId}/iniciar`,
      'PUT',
      null,
      token
    );
    console.log(`   Status: ${iniciarResult.status}`);
    if (iniciarResult.data.success) {
      console.log(`   ✅ Cirugía iniciada exitosamente`);
    } else {
      console.log(`   ⚠️ ${iniciarResult.data.message}`);
    }

    // 8. Finalizar cirugía
    console.log(`\n8. ⏹️ Finalizando cirugía ${cirugiaId}...`);
    const finalizarData = {
      observaciones_finales: "Cirugía completada sin complicaciones",
      diagnostico_postoperatorio: "Paciente estable, pronóstico favorable",
      observaciones_cirujano: "Procedimiento ejecutado según protocolo estándar",
      observaciones_anestesiologo: "Anestesia general sin incidentes"
    };

    const finalizarResult = await apiRequest(
      `/enfermera_jefe/cirugias/${cirugiaId}/finalizar`,
      'PUT',
      finalizarData,
      token
    );
    console.log(`   Status: ${finalizarResult.status}`);
    if (finalizarResult.data.success) {
      console.log(`   ✅ Cirugía finalizada exitosamente`);
    } else {
      console.log(`   ⚠️ ${finalizarResult.data.message}`);
    }
  }

  console.log('\n🎉 === PRUEBAS COMPLETADAS ===');
  console.log('\n📝 RESUMEN DE FUNCIONALIDADES PROBADAS:');
  console.log('   ✓ Autenticación de enfermera jefe');
  console.log('   ✓ Consulta de quirófanos disponibles');
  console.log('   ✓ Consulta de personal disponible');
  console.log('   ✓ Creación de cirugías con personal auxiliar');
  console.log('   ✓ Listado de cirugías con filtros');
  console.log('   ✓ Obtención de detalles de cirugía');
  console.log('   ✓ Inicio de cirugía');
  console.log('   ✓ Finalización de cirugía con observaciones');
}

// Ejecutar pruebas si este archivo se ejecuta directamente
if (typeof require !== 'undefined' && require.main === module) {
  testEnfermeraJefeAPI();
}

module.exports = { testEnfermeraJefeAPI };

console.log(`
🏥 SCRIPT DE PRUEBA - API ENFERMERA JEFE
========================================

Este script demuestra el uso completo de la API de Enfermera Jefe.

PARA EJECUTAR:
1. Asegúrate de que el servidor esté corriendo: npm start
2. Ejecuta este script: node test_enfermera_jefe.js

FUNCIONALIDADES INCLUIDAS:
• Gestión completa de cirugías (CRUD)
• Control de estados (iniciar/finalizar)
• Asignación de personal médico
• Verificación de disponibilidad de recursos
• Agregación de observaciones por tipo de personal

DOCUMENTACIÓN COMPLETA:
• docs/api/enfermera-jefe.md - API Reference
• docs/README.md - Arquitectura del sistema
`); 