import express from 'express';
import Leccion from '../models/Leccion.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.categoria) filtro.categoria = req.query.categoria;
    if (req.query.dificultad) filtro.dificultad = req.query.dificultad;

    const lecciones = await Leccion.find(filtro).sort({ orden: 1 });
    res.json(lecciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener lecciones', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const leccion = await Leccion.findById(req.params.id);
    if (!leccion) {
      return res.status(404).json({ mensaje: 'Lección no encontrada' });
    }
    res.json(leccion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener lección', error: error.message });
  }
});

export default router;
