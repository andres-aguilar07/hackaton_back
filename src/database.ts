import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import Usuario from './models/Usuario';
import Role from './models/Role';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'hackaton_bbdd',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Ho2025',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: console.log,
  models: [
    Role,
    Usuario
  ]
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};

export default sequelize; 