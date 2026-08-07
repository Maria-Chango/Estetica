import React from 'react';

function Nosotros() {
  return (
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Encabezado Principal */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">
            Nuestra Historia y Propósito
          </h1>
          <div className="w-20 h-1 bg-[#a37f5a] mx-auto rounded-full" />
          <p className="text-stone-600 max-w-2xl mx-auto mt-6 text-lg italic">
            "Más que estética, buscamos un espacio donde el cuidado personal se convierta en un ritual de bienestar."
          </p>
        </section>

        {/* Sección de dos columnas (Inspiración profesional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-stone-900">¿Quiénes somos?</h2>
            <p className="text-stone-600 leading-relaxed text-sm md:text-base">
              Somos un centro especializado en cosmetología y cuidado estético integral ubicado en Quito. Nacimos con la visión de transformar la experiencia tradicional de belleza, enfocándonos en un trato humano, técnico y altamente personalizado para cada tipo de piel.
            </p>
            <p className="text-stone-600 leading-relaxed text-sm md:text-base">
              Nuestra fundadora ha construido este espacio basándose en años de experiencia y una constante actualización en las últimas tendencias y tecnologías del mercado, garantizando siempre resultados seguros y visibles.
            </p>
          </div>
          <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80" 
              alt="Ambiente del centro estético" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Valores o Pilares (Estilo Tarjetas Modernas) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { titulo: "Calidad", desc: "Trabajamos exclusivamente con productos de marcas profesionales de alta gama." },
            { titulo: "Seguridad", desc: "Protocolos estrictos de higiene y evaluación previa para cada procedimiento." },
            { titulo: "Pasión", desc: "Nuestro equipo se mantiene en constante formación para ofrecer lo mejor." }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-[#fcf8f2] rounded-2xl border border-[#e3d5c5] text-center space-y-3">
              <h3 className="font-serif font-bold text-lg text-[#3a322d]">{item.titulo}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

export default Nosotros;