import Leccion from './models/Leccion.js';
import EjercicioOracle from './models/EjercicioOracle.js';
import { leccionesIniciales } from './data/leccionesSeed.js';
import { ejerciciosOracleIniciales } from './data/oracleSeed.js';

export async function seedLecciones() {
  const count = await Leccion.countDocuments();
  if (count > 0) return;

  await Leccion.insertMany(leccionesIniciales);
  console.log(`Sembradas ${leccionesIniciales.length} lecciones de algoritmos y estructuras`);
}

export async function seedOracle() {
  const count = await EjercicioOracle.countDocuments();
  if (count > 0) return;

  await EjercicioOracle.insertMany(ejerciciosOracleIniciales);
  console.log(`Sembrados ${ejerciciosOracleIniciales.length} ejercicios Oracle 26ai`);
}
