import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'hospital_cirugias',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: console.log
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection(); 