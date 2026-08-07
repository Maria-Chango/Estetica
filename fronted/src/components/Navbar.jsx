import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="w-full font-sans bg-[#c29f92] shadow-sm">
      
      {/* 1. BARRA SUPERIOR (Redes Sociales Funcionales) */}
      <div className="w-full bg-[#fefefe] text-stone-700 text-xs py-1.5 px-6 border-b border-stone-100">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <div className="flex items-center gap-3 text-stone-600 text-[11px]">
            <a 
              href="https://www.facebook.com/tu-pagina" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-stone-900 transition-colors"
            >
              Facebook
            </a>
            <span className="text-stone-300">|</span>
            <a 
              href="https://www.instagram.com/tu-usuario" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-stone-900 transition-colors"
            >
              Instagram
            </a>
            <span className="text-stone-300">|</span>
            <a 
              href="https://www.tiktok.com/@tu-usuario" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-stone-900 transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE NAVEGACIÓN PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-nowrap justify-between items-center gap-4">

        {/* LOGO / NOMBRE DEL LOCAL */}
        <Link to="/" className="group shrink-0">
          <span className="block text-lg xl:text-xl font-serif font-bold text-white tracking-wider uppercase leading-tight">
            Marie Valentina Spa y Estética
          </span>
          <span className="block text-[9px] text-stone-100 uppercase tracking-widest">
            Cuidado Profesional
          </span>
        </Link>

        {/* ENLACES CENTRALES */}
        <div className="flex flex-nowrap items-center gap-x-3 xl:gap-x-5 text-[11px] xl:text-xs font-bold text-white uppercase tracking-wider shrink-0">
          <Link to="/nosotros" className="hover:text-stone-900 transition-colors">
            Nosotros
          </Link>
          <Link to="/servicios" className="hover:text-stone-900 transition-colors">
            Servicios
          </Link>
          <Link to="/productos" className="hover:text-stone-900 transition-colors">
            Productos
          </Link>
          <Link to="/mis-citas" className="hover:text-stone-900 transition-colors">
            Mis Citas
          </Link>
          <Link to="/mis-productos" className="hover:text-stone-900 transition-colors">
            Mis Productos
          </Link>
          <Link to="/admin" className="hover:text-stone-900 transition-colors">
            Panel Admin
          </Link>
        </div>

        {/* BOTÓN CTA */}
        <Link
          to="/agendar"
          className="inline-block bg-white text-stone-700 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-stone-50 transition-all shadow-xs shrink-0 whitespace-nowrap text-center"
        >
          Agenda tu cita
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;