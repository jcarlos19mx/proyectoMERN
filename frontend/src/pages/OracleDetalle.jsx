import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API = '/api/oracle';

function renderTexto(texto) {
  return texto.split('\n\n').map((parrafo, i) => {
    const html = parrafo
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function OracleDetalle() {
  const { id } = useParams();
  const [ejercicio, setEjercicio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarPista, setMostrarPista] = useState(false);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        setError('');
        setCargando(true);
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error('Ejercicio no encontrado');
        setEjercicio(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  if (cargando) return <p className="estado">Cargando ejercicio...</p>;
  if (error) return <div className="error">{error}</div>;
  if (!ejercicio) return null;

  return (
    <div className="leccion-detalle oracle-detalle">
      <Link to="/oracle" className="volver">
        ← Volver al taller Oracle
      </Link>

      <div className="card">
        <div className="leccion-badges">
          <span className="badge badge-oracle">Módulo {ejercicio.modulo}</span>
          <span className="badge badge-tema">{ejercicio.numero} — {ejercicio.subtema}</span>
          <span className={`badge badge-${ejercicio.dificultad}`}>
            {ejercicio.dificultad.charAt(0).toUpperCase() + ejercicio.dificultad.slice(1)}
          </span>
          <span className="badge badge-horas">~{ejercicio.horasSugeridas}h</span>
        </div>

        <p className="oracle-modulo-nombre">{ejercicio.moduloNombre}</p>
        <h2>{ejercicio.titulo}</h2>

        {ejercicio.contexto && (
          <div className="complejidad-box oracle-contexto">
            <strong>Contexto:</strong> {ejercicio.contexto}
          </div>
        )}

        <section className="seccion-teoria">
          <h3>Enunciado</h3>
          <div className="contenido-teoria">{renderTexto(ejercicio.enunciado)}</div>
        </section>

        {ejercicio.scriptBase && (
          <section className="seccion-codigo">
            <h3>Script base (Oracle 26ai)</h3>
            <pre><code>{ejercicio.scriptBase}</code></pre>
          </section>
        )}

        {ejercicio.pista && (
          <section className="seccion-pista">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setMostrarPista(!mostrarPista)}
            >
              {mostrarPista ? 'Ocultar pista' : 'Mostrar pista'}
            </button>
            {mostrarPista && <p>{ejercicio.pista}</p>}
          </section>
        )}

        {ejercicio.solucion && (
          <section className="seccion-solucion">
            <button
              type="button"
              className="btn btn-oracle"
              onClick={() => setMostrarSolucion(!mostrarSolucion)}
            >
              {mostrarSolucion ? 'Ocultar solución' : 'Mostrar solución SQL'}
            </button>
            {mostrarSolucion && (
              <pre><code>{ejercicio.solucion}</code></pre>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
