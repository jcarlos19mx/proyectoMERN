import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Notas from './pages/Notas.jsx';
import Algoritmos from './pages/Algoritmos.jsx';
import LeccionDetalle from './pages/LeccionDetalle.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Notas />} />
          <Route path="algoritmos" element={<Algoritmos />} />
          <Route path="algoritmos/:id" element={<LeccionDetalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
