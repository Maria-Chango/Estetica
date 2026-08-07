import React, { useState } from 'react';

function Servicios() {
  // Estado para controlar qué categoría o servicio está viendo el usuario
  const [servicioActivo, setServicioActivo] = useState('cabello');

  // Información detallada de los nuevos servicios del negocio
  const informacionServicios = {
    cabello: {
      titulo: "Estilismo y Cuidado del",
      subtitulo: "Cabello",
      descripcion: "Ofrecemos servicios de corte personalizado, aplicación de tintes de alta gama, peinados profesionales y ondulados duraderos adaptados a la estructura y salud de tu fibra capilar.",
      seccionTitulo: "Expertos en Tendencias Capilares",
      seccionTexto: "Nuestro equipo se mantiene en constante capacitación para ofrecerte las últimas técnicas en colorimetría y diseño de imagen. Utilizamos exclusivamente productos profesionales que protegen la cutícula del cabello, aportando un brillo extraordinario y garantizando un acabado saludable que respete la integridad de tu melena.",
      imagen: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
      beneficios: [
        "Asesoría de imagen personalizada según tus rasgos y tipo de rostro.",
        "Coloración de larga duración con máxima cobertura y protección capilar.",
        "Técnicas de texturización y peinado de alta durabilidad."
      ]
    },
    mirada: {
      titulo: "Diseño y Realce de la",
      subtitulo: "Mirada",
      descripcion: "Transforma tus ojos con nuestros servicios especializados de lifting de pestañas, laminado de cejas y aplicación de tinte semipermanente para un efecto impecable.",
      seccionTitulo: "Arquitectura y Simetría Facial",
      seccionTexto: "Las cejas y pestañas son el marco del rostro. Mediante técnicas avanzadas de laminado y elevación natural, logramos estructurar y disciplinar el vello rebelde sin dañarlo. Diseñamos la curvatura y el grosor ideal respetando tu fisonomía natural para que luzcas una mirada expresiva, fresca y despierta desde que te levantas.",
      imagen: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
      beneficios: [
        "Efecto de cejas más pobladas, ordenadas y definidas al instante.",
        "Pestañas visualmente más largas y curvas sin necesidad de usar rizador.",
        "Resultados semipermanentes de bajo mantenimiento ideales para el día a día."
      ]
    },
    manosPies: {
      titulo: "Spa de Manos y",
      subtitulo: "Pies",
      descripcion: "Tratamientos completos de manicura y pedicura que combinan una limpieza profunda de uñas, exfoliación, hidratación y esmaltados profesionales de alta resistencia.",
      seccionTitulo: "Salud, Higiene y Estética Integral",
      seccionTexto: "Tus manos y pies merecen un cuidado especializado que va más allá del color. Nos enfocamos minuciosamente en la remoción higiénica de cutículas, limado anatómico y eliminación de asperezas. Trabajamos bajo estrictos protocolos de esterilización y con marcas de esmalte premium que garantizan un brillo y fijación prolongada.",
      imagen: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
      beneficios: [
        "Uñas perfectamente moldeadas, fortalecidas y libres de imperfecciones.",
        "Piel profundamente suave, renovada e hidratada mediante masajes ligeros.",
        "Esmaltados duraderos con acabados impecables y protección UV."
      ]
    },
    facial: {
      titulo: "Limpieza Facial",
      subtitulo: "Purificante",
      descripcion: "Tratamiento de higiene cutánea profunda diseñado para eliminar impurezas, retirar células muertas y restaurar el equilibrio hídrico natural de tu rostro.",
      seccionTitulo: "Renovación y Salud Cutánea",
      seccionTexto: "La exposición diaria a la contaminación satura los poros y apaga tu piel. Nuestro protocolo de limpieza facial combina técnicas de extracción delicadas y mascarillas adaptadas a las necesidades específicas de tu dermis. Logramos oxigenar los tejidos faciales, regular la producción de grasa y preparar la piel para absorber eficientemente tus productos diarios.",
      imagen: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      beneficios: [
        "Desintoxica los poros y previene la aparición de molestos puntos negros.",
        "Devuelve la luminosidad natural y suaviza la textura áspera de la piel.",
        "Estimula la regeneración celular y la microcirculación del rostro."
      ]
    },
    maquillaje: {
      titulo: "Maquillaje Profesional",
      subtitulo: "Social",
      descripcion: "Creación de looks personalizados para eventos, sesiones fotográficas u ocasiones especiales utilizando técnicas de alta definición y productos de larga duración.",
      seccionTitulo: "Tu Mejor Versión para Cada Ocasión",
      seccionTexto: "Diseñamos tu maquillaje analizando las condiciones de luz del evento y tu estilo personal, asegurando un acabado cómodo, fotogénico y sumamente resistente. Desde estilos sutiles y naturales hasta propuestas sofisticadas de noche, nos enfocamos en destacar tus rasgos más hermosos y garantizar que te sientas segura durante horas.",
      imagen: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      beneficios: [
        "Productos profesionales e hipoalergénicos con resistencia al sudor y lágrimas.",
        "Técnicas de difuminado y corrección que lucen perfectas en video y fotografía.",
        "Preparación previa de la piel para asegurar un acabado fresco y sin efecto acartonado."
      ]
    }
  };

  // Guardamos los datos del servicio seleccionado actualmente
  const datos = informacionServicios[servicioActivo];

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* 1. MENÚ DE PESTAÑAS */}
      <div className="border-b border-stone-200 bg-stone-50/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex overflow-x-auto justify-start md:justify-center text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap">
          <button
            onClick={() => setServicioActivo('cabello')}
            className={`px-5 py-4 transition-all border-b-2 ${servicioActivo === 'cabello' ? 'border-[#a37f5a] bg-white text-[#a37f5a]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Cabello
          </button>
          <button
            onClick={() => setServicioActivo('mirada')}
            className={`px-5 py-4 transition-all border-b-2 ${servicioActivo === 'mirada' ? 'border-[#a37f5a] bg-white text-[#a37f5a]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Cejas y Pestañas
          </button>
          <button
            onClick={() => setServicioActivo('manosPies')}
            className={`px-5 py-4 transition-all border-b-2 ${servicioActivo === 'manosPies' ? 'border-[#a37f5a] bg-white text-[#a37f5a]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Manos y Pies
          </button>
          <button
            onClick={() => setServicioActivo('facial')}
            className={`px-5 py-4 transition-all border-b-2 ${servicioActivo === 'facial' ? 'border-[#a37f5a] bg-white text-[#a37f5a]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Limpieza Facial
          </button>
          <button
            onClick={() => setServicioActivo('maquillaje')}
            className={`px-5 py-4 transition-all border-b-2 ${servicioActivo === 'maquillaje' ? 'border-[#a37f5a] bg-white text-[#a37f5a]' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
          >
            Maquillaje
          </button>
        </div>
      </div>

      {/* 2. CABECERA PRINCIPAL DEL SERVICIO SELECCIONADO */}
      <section className="max-w-4xl mx-auto text-center px-6 py-12 md:py-16 space-y-4">
        <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-bold tracking-tight leading-tight">
          {datos.titulo} <br className="md:hidden" /> <span className="text-[#a37f5a] font-light italic">{datos.subtitulo}</span>
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {datos.descripcion}
        </p>
      </section>

      {/* 3. BLOQUE DE DOS COLUMNAS (Imagen izquierda, Información detallada derecha) */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Columna de la Imagen */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-stone-100">
              <img
                src={datos.imagen}
                alt={datos.titulo}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Columna de la Descripción Técnica del Servicio */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-stone-900 leading-tight">
              {datos.seccionTitulo}
            </h2>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              {datos.seccionTexto}
            </p>

            {/* Listado de Beneficios */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-stone-900 font-bold text-xs mb-3 uppercase tracking-wider">
                Beneficios del Servicio:
              </h3>
              <ul className="space-y-3 text-sm text-stone-600">
                {datos.beneficios.map((beneficio, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#a37f5a]">✨</span>
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Servicios;