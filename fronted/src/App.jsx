import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Servicios from './pages/Servicios';
import Productos from './pages/Productos';
import Admin from './pages/Admin';
import Nosotros from './pages/Nosotros';
import Agenda from './pages/Agenda';
import MisCitas from './pages/MisCitas'; 
import MisProductos from './pages/MisProductos'; 

function App() {
  // Estado centralizado del catálogo de productos y stock
  const [catalogo, setCatalogo] = useState({
    perfumes: [
      {
        id: 1,
        nombre: "Perfume Exclusivo Mujer",
        descripcion: "Fragancia floral de larga duración con notas de jazmín y vainilla.",
        precio: 45.00,
        stock: 5,
        imagen: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
        enOferta: false,
        precioOferta: null
      }
    ],
    cremas: [],
    joyeria: [],
    ceramicas: [],
    tejidos: []
  });

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/servicios" element={<Servicios />} />
            
            {/* Pasamos catalogo a la vista de tienda */}
            <Route path="/productos" element={<Productos catalogo={catalogo} />} />
            
            <Route path="/mis-citas" element={<MisCitas />} />
            <Route path="/mis-productos" element={<MisProductos />} />
            <Route path="/agendar" element={<Agenda />} /> 

            {/* Pasamos catalogo y setCatalogo al panel de administración para modificar stock y ofertas */}
            <Route path="/admin" element={<Admin catalogo={catalogo} setCatalogo={setCatalogo} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;