import { useEffect, useState } from 'react';

const API = '/api/notas';

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ titulo: '', contenido: '', autor: '' });

  const cargarNotas = async () => {
    try {
      setError('');
      const res = await fetch(API);
      if (!res.ok) throw new Error('No se pudieron cargar las notas');
      const data = await res.json();
      setNotas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('No se pudo crear la nota');
      const nuevaNota = await res.json();
      setNotas([nuevaNota, ...notas]);
      setForm({ titulo: '', contenido: '', autor: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarNota = async (id) => {
    try {
      setError('');
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar la nota');
      setNotas(notas.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="titulo"
            placeholder="Título de la nota"
            value={form.titulo}
            onChange={handleChange}
            required
          />
          <textarea
            name="contenido"
            placeholder="Escribe tu nota aquí..."
            value={form.contenido}
            onChange={handleChange}
            required
          />
          <input
            name="autor"
            placeholder="Tu nombre (opcional)"
            value={form.autor}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary">
            Agregar nota
          </button>
        </form>
      </div>

      {cargando ? (
        <p className="estado">Cargando notas...</p>
      ) : notas.length === 0 ? (
        <p className="estado">No hay notas aún. ¡Sé el primero en escribir una!</p>
      ) : (
        <div className="notas-lista">
          {notas.map((nota) => (
            <article key={nota._id} className="nota">
              <div className="nota-header">
                <h3>{nota.titulo}</h3>
                <button
                  className="btn btn-danger"
                  onClick={() => eliminarNota(nota._id)}
                  aria-label="Eliminar nota"
                >
                  Eliminar
                </button>
              </div>
              <p>{nota.contenido}</p>
              <div className="nota-meta">
                Por {nota.autor} · {formatearFecha(nota.createdAt)}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
