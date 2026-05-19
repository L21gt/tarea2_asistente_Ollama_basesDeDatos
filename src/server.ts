import express, { Application } from 'express';
import dotenv from 'dotenv';
import assistantRoutes from './routes/assistant.routes';

// Cargar las variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisis de cuerpos JSON
app.use(express.json());

// Vinculacion de las rutas del asistente inteligente bajo el prefijo estandar /api
app.use('/api', assistantRoutes);

// Ruta de comprobacion de estado
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Express con TypeScript activo' });
});

app.listen(PORT, () => {
  console.log(`[SERVER]: Servidor ejecutandose exitosamente en http://localhost:${PORT}`);
});