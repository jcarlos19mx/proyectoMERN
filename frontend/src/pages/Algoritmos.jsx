import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = '/api/lecciones';

const etiquetas = {
  categoria: {
    estructura: { label: 'Estructura', clase: 'badge-estructura' },
    algoritmo: { label: 'Algoritmo', clase: 'badge-algoritmo' },
  },
  dificultad: {
    basico: { label: 'Básico', clase: 'badge-basico' },
    intermedio: { label: 'Intermedio', clase: 'badge-intermedio' },
    avanzado: { label: 'Avanzado', clase: 'badge-avanzado' },
  },
};

export default function Algoritmos() {
  const [lecciones, setLecciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({ categoria: '', dificultad: '' });

  useEffect(() => {
    const cargar = async () => {
      try {
        setError('');
        setCargando(true);
        const params = new URLSearchParams();
        if (filtro.categoria) params.set('categoria', filtro.categoria);
        if (filtro.dificultad) params.set('dificultad', filtro.dificultad);
        const query = params.toString() ? `?${params}` : '';
        const res = await fetch(`${API}${query}`);
        if (!res.ok) throw new Error('No se pudieron cargar las lecciones');
        setLecciones(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [filtro]);

  return (
    <>
      <div className="card modulo-intro">
        <h2>Módulo de Algoritmos y Estructuras de Datos</h2>
        <p>
          Aprende conceptos fundamentales con teoría, ejemplos en JavaScript y ejercicios
          prácticos. Ideal para repasar antes de entrevistas o exámenes.
        </p>
        <div className="stats">
          <span>{lecciones.filter((l) => l.categoria === 'estructura').length} estructuras</span>
          <span>{lecciones.filter((l) => l.categoria === 'algoritmo').length} algoritmos</span>
        </div>
      </div>

      <div className="card filtros">
        <label>
          Categoría
          <select
            value={filtro.categoria}
            onChange={(e) => setFiltro({ ...filtro, categoria: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="estructura">Estructuras de datos</option>
            <option value="algoritmo">Algoritmos</option>
          </select>
        </label>
        <label>
          Dificultad
          <select
            value={filtro.dificultad}
            onChange={(e) => setFiltro({ ...filtro, dificultad: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="basico">Básico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </label>
      </div>

      {error && <div className="error">{error}</div>}

      {cargando ? (
        <p className="estado">Cargando lecciones...</p>
      ) : lecciones.length === 0 ? (
        <p className="estado">No hay lecciones con esos filtros.</p>
      ) : (
        <div className="lecciones-grid">
          {lecciones.map((leccion) => (
            <Link key={leccion._id} to={`/algoritmos/${leccion._id}`} className="leccion-card">
              <div className="leccion-badges">
                <span className={`badge ${etiquetas.categoria[leccion.categoria].clase}`}>
                  {etiquetas.categoria[leccion.categoria].label}
                </span>
                <span className={`badge ${etiquetas.dificultad[leccion.dificultad].clase}`}>
                  {etiquetas.dificultad[leccion.dificultad].label}
                </span>
              </div>
              <h3>{leccion.titulo}</h3>
              <p className="leccion-tema">{leccion.tema}</p>
              <p className="leccion-desc">{leccion.descripcion}</p>
              {leccion.complejidad && (
                <span className="leccion-complejidad">{leccion.complejidad}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
