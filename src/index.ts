import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para logging por request
app.use(morgan('dev'));

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola mundo con TypeScript y Express!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});