import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notas = await Note.find().sort({ createdAt: -1 });
    res.json(notas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener notas', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titulo, contenido, autor } = req.body;

    if (!titulo?.trim() || !contenido?.trim()) {
      return res.status(400).json({ mensaje: 'Título y contenido son obligatorios' });
    }

    const nota = await Note.create({ titulo, contenido, autor });
    res.status(201).json(nota);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear nota', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const nota = await Note.findByIdAndDelete(req.params.id);

    if (!nota) {
      return res.status(404).json({ mensaje: 'Nota no encontrada' });
    }

    res.json({ mensaje: 'Nota eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar nota', error: error.message });
  }
});

export default router;
