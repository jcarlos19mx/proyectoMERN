import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import notesRouter from './routes/notes.js';
import leccionesRouter from './routes/lecciones.js';
import oracleRouter from './routes/oracle.js';
import { seedLecciones, seedOracle } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', mensaje: 'API funcionando correctamente' });
});

app.use('/api/notas', notesRouter);
app.use('/api/lecciones', leccionesRouter);
app.use('/api/oracle', oracleRouter);

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-notas')
  .then(async () => {
    console.log('Conectado a MongoDB');
    await seedLecciones();
    await seedOracle();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  });
