import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API = '/api/lecciones';

function renderContenido(texto) {
  return texto.split('\n\n').map((parrafo, i) => {
    const html = parrafo
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function LeccionDetalle() {
  const { id } = useParams();
  const [leccion, setLeccion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        setError('');
        setCargando(true);
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error('Lección no encontrada');
        setLeccion(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  if (cargando) return <p className="estado">Cargando lección...</p>;
  if (error) return <div className="error">{error}</div>;
  if (!leccion) return null;

  return (
    <div className="leccion-detalle">
      <Link to="/algoritmos" className="volver">
        ← Volver al módulo
      </Link>

      <div className="card">
        <div className="leccion-badges">
          <span className={`badge badge-${leccion.categoria === 'estructura' ? 'estructura' : 'algoritmo'}`}>
            {leccion.categoria === 'estructura' ? 'Estructura' : 'Algoritmo'}
          </span>
          <span className={`badge badge-${leccion.dificultad}`}>
            {leccion.dificultad.charAt(0).toUpperCase() + leccion.dificultad.slice(1)}
          </span>
          <span className="badge badge-tema">{leccion.tema}</span>
        </div>

        <h2>{leccion.titulo}</h2>
        <p className="leccion-desc">{leccion.descripcion}</p>

        {leccion.complejidad && (
          <div className="complejidad-box">
            <strong>Complejidad:</strong> {leccion.complejidad}
          </div>
        )}

        <section className="seccion-teoria">
          <h3>Teoría</h3>
          <div className="contenido-teoria">{renderContenido(leccion.contenido)}</div>
        </section>

        {leccion.codigoEjemplo && (
          <section className="seccion-codigo">
            <h3>Ejemplo en JavaScript</h3>
            <pre><code>{leccion.codigoEjemplo}</code></pre>
          </section>
        )}

        {leccion.ejercicio && (
          <section className="seccion-ejercicio">
            <h3>Ejercicio práctico</h3>
            <p>{leccion.ejercicio}</p>
          </section>
        )}
      </div>
    </div>
  );
}
