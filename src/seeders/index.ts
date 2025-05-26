import { seedInitialData } from './001-initial-data';

export const runAllSeeders = async (): Promise<void> => {
  try {
    console.log('🚀 Ejecutando todos los seeders...');
    
    await seedInitialData();
    
    console.log('✅ Todos los seeders se ejecutaron correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  }
};

export { seedInitialData }; 