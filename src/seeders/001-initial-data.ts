import * as bcrypt from 'bcrypt';
import sequelize from '../database';
import Role from '../models/Role';
import Usuario from '../models/Usuario';

export const seedInitialData = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando seeders...');

    // Crear roles
    const roles = [
      { nombre: 'administrador', descripcion: 'Administrador del sistema con acceso completo' },
      { nombre: 'enfermera_jefe', descripcion: 'Enfermera jefe con permisos de supervisión' },
      { nombre: 'central', descripcion: 'Personal de central de esterilización' },
      { nombre: 'farmacia', descripcion: 'Personal de farmacia' },
      { nombre: 'instrumentador', descripcion: 'Instrumentador quirúrgico' }
    ];

    console.log('📝 Creando roles...');
    const createdRoles = [];
    for (const roleData of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { nombre: roleData.nombre },
        defaults: roleData
      });
      
      if (created) {
        console.log(`✅ Rol creado: ${role.nombre}`);
      } else {
        console.log(`ℹ️  Rol ya existe: ${role.nombre}`);
      }
      createdRoles.push(role);
    }

    // Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    
    // Buscar el rol de administrador
    const adminRole = createdRoles.find(role => role.nombre === 'administrador');
    if (!adminRole) {
      throw new Error('No se pudo encontrar el rol de administrador');
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('1234', saltRounds);

    // Crear el usuario administrador
    const [adminUser, created] = await Usuario.findOrCreate({
      where: { email: 'admin@hospital.com' },
      defaults: {
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@hospital.com',
        password_hash: hashedPassword,
        cedula: 'ADMIN001',
        telefono: '1234567890',
        rol_id: adminRole.id,
        activo: true
      }
    });

    if (created) {
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email: admin@hospital.com');
      console.log('🔑 Contraseña: 1234');
      console.log('👤 Usuario: admin');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }

    console.log('🎉 Seeders completados exitosamente');

  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  }
};

// Función para ejecutar seeders si se llama directamente
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      await seedInitialData();
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
} 