import React from 'react';

function Inicio() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. CINTILLO SUPERIOR (Informativo y discreto) */}
      <div className="bg-[#f4ebe1] text-[#6e5d4f] text-xs py-2 px-4 border-b border-[#e6dcd0]">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <p className="font-medium tracking-wide uppercase">Bienvenida a Marie Valentina Spa y Estética</p>
        </div>
      </div>

      {/* 2. HERO SECTION / BANNER PRINCIPAL */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* COLUMNA IZQUIERDA: Textos */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[#7b4106] text-2xs font-bold uppercase tracking-widest block">
              Estética Profesional
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-tight">
              Centro estético que transformará tu <span className="text-[#a37f5a]">apariencia y bienestar</span>
            </h1>

            <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-2xl">
              En nuestro centro estético creemos que cada persona merece sentirse cómoda, auténtica y segura de sí misma. Por eso, te ofrecemos un espacio pensado exclusivamente para ti, donde tu salud y tu bienestar son nuestra verdadera inspiración.
            </p>

            <div className="pt-2">
              <p className="text-stone-900 font-semibold text-sm mb-4">
                Nuestros servicios especializados de belleza y bienestar:
              </p>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#c29b74]">✨</span>
                  <span><strong>Corte, tinte y peinado:</strong> Estilismo completo para renovar tu look y darle vida a tu cabello.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c29b74]">✨</span>
                  <span><strong>Ondulados de cabello:</strong> Textura y volumen duradero con acabados naturales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c29b74]">✨</span>
                  <span><strong>Laminado y tinte de cejas:</strong> Diseño y definición experta para potenciar tu mirada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c29b74]">✨</span>
                  <span><strong>Lifting de pestañas:</strong> Elevación y curvatura natural para un efecto de máscara diario.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c29b74]">✨</span>
                  <span><strong>Manicura y pedicura:</strong> Cuidado profundo y esmaltado impecable para tus manos y pies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c29b74]">✨</span>
                  <span><strong>Limpieza facial:</strong> Tratamiento purificante para restaurar la frescura y salud de tu piel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c29b74]">✨</span>
                  <span><strong>Maquillaje profesional:</strong> Estilos personalizados para destacar en cualquier evento u ocasión especial.</span>
                </li>
              </ul>
            </div>

            {/* SECCIÓN LIMPIA: Espacio para algún mensaje adicional o simplemente el cierre del bloque */}
            <div className="pt-6">
              <p className="text-[#a37f5a] font-medium italic">
                "Tu belleza es el reflejo de tu cuidado personal."
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: Imagen */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80"
                alt="Tratamiento Estético Profesional"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}

export default Inicio;