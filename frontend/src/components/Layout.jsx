import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { pathname } = useLocation();

  const esActivo = (ruta) => {
    if (ruta === '/') return pathname === '/';
    return pathname.startsWith(ruta);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>MERN Academy</h1>
        <p>Notas compartidas y aprendizaje de algoritmos</p>
        <nav className="nav">
          <Link to="/" className={`nav-link${esActivo('/') ? ' activo' : ''}`}>
            Notas
          </Link>
          <Link to="/algoritmos" className={`nav-link${esActivo('/algoritmos') ? ' activo' : ''}`}>
            Algoritmos y Estructuras
          </Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
