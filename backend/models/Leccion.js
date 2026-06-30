import mongoose from 'mongoose';

const leccionSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    categoria: {
      type: String,
      enum: ['estructura', 'algoritmo'],
      required: true,
    },
    tema: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    contenido: { type: String, required: true },
    codigoEjemplo: { type: String, default: '' },
    complejidad: { type: String, default: '' },
    dificultad: {
      type: String,
      enum: ['basico', 'intermedio', 'avanzado'],
      default: 'basico',
    },
    ejercicio: { type: String, default: '' },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Leccion', leccionSchema);
