import express from 'express';
import EjercicioOracle from '../models/EjercicioOracle.js';

const router = express.Router();

const TEMARIO = [
  { modulo: 1, nombre: 'Lenguaje de definición de datos (DDL)' },
  { modulo: 2, nombre: 'Lenguaje de manipulación de datos (DML)' },
  { modulo: 3, nombre: 'Control de acceso' },
  { modulo: 4, nombre: 'Concurrencia' },
  { modulo: 5, nombre: 'SQL Procedural' },
  { modulo: 6, nombre: 'Conectividad de Bases de Datos' },
];

router.get('/temario', (req, res) => {
  res.json({ duracionHoras: 64, modulos: TEMARIO });
});

router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.modulo) filtro.modulo = Number(req.query.modulo);
    if (req.query.dificultad) filtro.dificultad = req.query.dificultad;

    const ejercicios = await EjercicioOracle.find(filtro).sort({ orden: 1 });
    res.json(ejercicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ejercicios', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ejercicio = await EjercicioOracle.findById(req.params.id);
    if (!ejercicio) {
      return res.status(404).json({ mensaje: 'Ejercicio no encontrado' });
    }
    res.json(ejercicio);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ejercicio', error: error.message });
  }
});

export default router;
