import Leccion from './models/Leccion.js';
import { leccionesIniciales } from './data/leccionesSeed.js';

export async function seedLecciones() {
  const count = await Leccion.countDocuments();
  if (count > 0) return;

  await Leccion.insertMany(leccionesIniciales);
  console.log(`Sembradas ${leccionesIniciales.length} lecciones de algoritmos y estructuras`);
}
