import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
    autor: {
      type: String,
      default: 'Anónimo',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);
