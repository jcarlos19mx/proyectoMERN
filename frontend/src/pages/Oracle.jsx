import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = '/api/oracle';

const etiquetasDificultad = {
  basico: { label: 'Básico', clase: 'badge-basico' },
  intermedio: { label: 'Intermedio', clase: 'badge-intermedio' },
  avanzado: { label: 'Avanzado', clase: 'badge-avanzado' },
};

export default function Oracle() {
  const [ejercicios, setEjercicios] = useState([]);
  const [temario, setTemario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({ modulo: '', dificultad: '' });

  useEffect(() => {
    const cargar = async () => {
      try {
        setError('');
        setCargando(true);
        const params = new URLSearchParams();
        if (filtro.modulo) params.set('modulo', filtro.modulo);
        if (filtro.dificultad) params.set('dificultad', filtro.dificultad);
        const query = params.toString() ? `?${params}` : '';

        const [resEj, resTem] = await Promise.all([
          fetch(`${API}${query}`),
          fetch(`${API}/temario`),
        ]);

        if (!resEj.ok) throw new Error('No se pudieron cargar los ejercicios');
        setEjercicios(await resEj.json());
        if (resTem.ok) setTemario(await resTem.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [filtro]);

  const horasTotales = ejercicios.reduce((sum, e) => sum + e.horasSugeridas, 0);

  const ejerciciosPorModulo = (modulo) =>
    ejercicios.filter((e) => e.modulo === modulo).length;

  return (
    <>
      <div className="card modulo-intro oracle-intro">
        <h2>Taller de Bases de Datos — Oracle 26ai</h2>
        <p>
          Ejercicios prácticos alineados al temario oficial del taller de 64 horas.
          Cada ejercicio incluye enunciado, script base, pistas y solución SQL para practicar en
          SQL Developer o SQL*Plus.
        </p>
        <div className="stats oracle-stats">
          <span>{temario?.duracionHoras ?? 64} horas del curso</span>
          <span>{ejercicios.length} ejercicios</span>
          <span>{horasTotales} h sugeridas en selección</span>
        </div>
      </div>

      {temario && (
        <div className="card temario-grid">
          <h3>Temario del taller</h3>
          <div className="modulos-lista">
            {temario.modulos.map((m) => (
              <button
                key={m.modulo}
                type="button"
                className={`modulo-chip${filtro.modulo === String(m.modulo) ? ' activo' : ''}`}
                onClick={() =>
                  setFiltro({
                    ...filtro,
                    modulo: filtro.modulo === String(m.modulo) ? '' : String(m.modulo),
                  })
                }
              >
                <span className="modulo-num">{m.modulo}</span>
                <span className="modulo-nombre">{m.nombre}</span>
                <span className="modulo-count">{ejerciciosPorModulo(m.modulo)} ej.</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card filtros">
        <label>
          Módulo
          <select
            value={filtro.modulo}
            onChange={(e) => setFiltro({ ...filtro, modulo: e.target.value })}
          >
            <option value="">Todos</option>
            {temario?.modulos.map((m) => (
              <option key={m.modulo} value={m.modulo}>
                {m.modulo}. {m.nombre}
              </option>
            ))}
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
        <p className="estado">Cargando ejercicios...</p>
      ) : ejercicios.length === 0 ? (
        <p className="estado">No hay ejercicios con esos filtros.</p>
      ) : (
        <div className="lecciones-grid">
          {ejercicios.map((ej) => (
            <Link key={ej._id} to={`/oracle/${ej._id}`} className="leccion-card oracle-card">
              <div className="leccion-badges">
                <span className="badge badge-oracle">Mód. {ej.modulo}</span>
                <span className="badge badge-tema">{ej.numero}</span>
                <span className={`badge ${etiquetasDificultad[ej.dificultad].clase}`}>
                  {etiquetasDificultad[ej.dificultad].label}
                </span>
              </div>
              <h3>{ej.titulo}</h3>
              <p className="leccion-tema">{ej.subtema}</p>
              <p className="leccion-desc">{ej.enunciado.slice(0, 120)}...</p>
              <span className="leccion-complejidad oracle-horas">
                ~{ej.horasSugeridas}h sugeridas
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
