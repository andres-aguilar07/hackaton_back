import * as dotenv from 'dotenv';
import { connectDatabase } from './database';
import { runAllSeeders } from './seeders';

// Cargar variables de entorno
dotenv.config();

const runSeeders = async (): Promise<void> => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await connectDatabase();
    
    console.log('🌱 Ejecutando seeders...');
    await runAllSeeders();
    
    console.log('🎉 Proceso completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el proceso de seeders:', error);
    process.exit(1);
  }
};

runSeeders(); 