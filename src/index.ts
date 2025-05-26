import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import { connectDatabase } from './database';
import authRouter from './routers/auth_router';
import adminRouter from './routers/admin_router';
import enfermeraJefeRouter from './routers/enfermeraJefeRouter';
import suministrosRouter from './routers/suministrosRouter';
import instrumentadorRouter from './routers/instrumentadorRouter';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para logging por request
app.use(morgan('dev'));

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '¡API del Sistema de Gestión Hospitalaria funcionando correctamente!',
    version: '1.0.0'
  });
});

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Rutas administrativas
app.use('/api/v1/admin', adminRouter);

// Rutas de enfermera jefe
app.use('/api/v1/enfermera_jefe', enfermeraJefeRouter);

// Rutas de suministros (Central y Farmacia)
app.use('/api/v1/suministros', suministrosRouter);

// Rutas de instrumentador
app.use('/api/v1/instrumentador', instrumentadorRouter);

// Inicializar servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();
    
    // Iniciar servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      console.log(`📚 Documentación de API disponible en http://localhost:${port}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();