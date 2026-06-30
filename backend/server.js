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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-notas';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', mensaje: 'API funcionando correctamente' });
});

app.use('/api/notas', notesRouter);
app.use('/api/lecciones', leccionesRouter);
app.use('/api/oracle', oracleRouter);

async function iniciar() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB');
    await seedLecciones();
    await seedOracle();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor en http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB, reintentando en 5s...', error.message);
    setTimeout(iniciar, 5000);
  }
}

iniciar();
