import mongoose from 'mongoose';

const ejercicioOracleSchema = new mongoose.Schema(
  {
    numero: { type: String, required: true },
    modulo: { type: Number, required: true, min: 1, max: 6 },
    moduloNombre: { type: String, required: true },
    subtema: { type: String, required: true },
    titulo: { type: String, required: true },
    enunciado: { type: String, required: true },
    contexto: { type: String, default: '' },
    scriptBase: { type: String, default: '' },
    pista: { type: String, default: '' },
    solucion: { type: String, default: '' },
    dificultad: {
      type: String,
      enum: ['basico', 'intermedio', 'avanzado'],
      default: 'basico',
    },
    horasSugeridas: { type: Number, default: 2 },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('EjercicioOracle', ejercicioOracleSchema);
