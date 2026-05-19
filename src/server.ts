import express, { Application } from 'express';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir que el servidor entienda formato JSON en las peticiones
app.use(express.json());

// Ruta base de comprobación de estado de la API
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Express con TypeScript activo' });
});

// Inicialización de la escucha del servidor
app.listen(PORT, () => {
  console.log(`[SERVER]: Servidor ejecutándose exitosamente en http://localhost:${PORT}`);
});