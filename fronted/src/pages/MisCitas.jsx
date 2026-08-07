import React, { useState } from 'react';
const API_URL = "https://estetica-g10e.onrender.com";
const TELEFONO_DUENO = "593961360883"; // Número oficial y definitivo del dueño

function MisCitas() {
  const [telefonoBusqueda, setTelefonoBusqueda] = useState('');
  const [citasCliente, setCitasCliente] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [modoReprogramarId, setModoReprogramarId] = useState(null);
  
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('09');
  const [nuevoMinuto, setNuevoMinuto] = useState('00');

  const hoy = new Date().toISOString().split('T')[0];
  const fechaMax = new Date();
  fechaMax.setMonth(fechaMax.getMonth() + 3);
  const maxAnioStr = fechaMax.toISOString().split('T')[0];

  const horasPermitidas = ['09', '10', '11', '12', '14', '15', '16', '17', '18'];
  const minutosPermitidos = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Limpieza total y definitiva de servicios con letras desglosadas o comas múltiples
  const limpiarServicio = (servicio) => {
    if (!servicio) return "Servicio general";
    
    let textoPlano = "";
    if (Array.isArray(servicio)) {
      textoPlano = servicio.join(',');
    } else if (typeof servicio === 'string') {
      textoPlano = servicio;
    } else {
      return "Servicio general";
    }

    // Si detectamos formato de letras separadas por comas individuales (ej: C,o,r,t,e)
    if (textoPlano.includes(',')) {
      const fragmentos = textoPlano.split(',');
      // Si la gran mayoría son fragmentos de 1 sola letra, es una cadena desglosada
      const letrasSueltas = fragmentos.filter(f => f.trim().length <= 1).length;
      if (letrasSueltas > fragmentos.length / 2) {
        // Reconstruimos uniendo y separando por espacios donde había espacios vacíos
        const unido = fragmentos.join('');
        // Limpiamos nombres comunes si quedaron juntos
        return unido.replace(/Corte/gi, 'Corte ').replace(/Cabello/gi, 'Cabello ').replace(/Manicura/gi, 'Manicura ').replace(/\s+/g, ' ').trim();
      }
    }

    // Limpieza estándar de comas repetidas
    return textoPlano.replace(/,\s*,+/g, ',').replace(/,/g, ', ').replace(/\s+/g, ' ').trim();
  };

  const buscarMisCitas = async (telefonoObjetivo) => {
    const telAUsar = telefonoObjetivo || telefonoBusqueda;
    const regexEcuador = /^09\d{8}$/;
    if (!regexEcuador.test(telAUsar)) {
      alert("Ingresa un número de celular ecuatoriano válido de 10 dígitos (empieza con 09).");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/citas`);
      const citas = await res.json();
      if (Array.isArray(citas)) {
        const misCitasEncontradas = citas.filter(c => c.telefono === telAUsar);
        setCitasCliente(misCitasEncontradas);
        setBuscado(true);
        localStorage.setItem('marie_telefono_cliente', telAUsar);
      }
    } catch (err) {
      alert("Error al conectar con el servidor.");
    }
    setCargando(false);
  };

  const handleSubmitBusqueda = (e) => {
    e.preventDefault();
    buscarMisCitas(telefonoBusqueda);
  };

  const cancelarCita = async (cita) => {
    const motivo = prompt("Por favor, ingresa el motivo de tu cancelación:");
    if (!motivo) return;

    try {
      const response = await fetch(`${API_URL}/api/citas/${cita._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Cancelado', motivoCancelacion: motivo })
      });

      if (response.ok) {
        alert("Has cancelado tu cita correctamente.");
        
        const nombreServicio = limpiarServicio(cita.servicio);
        const fechaFormateada = new Date(cita.fecha).toLocaleString();

        const mensajeAdmin = `El cliente ${cita.nombre} ha cancelado su cita de ${nombreServicio} programada para el ${fechaFormateada}. Motivo: ${motivo}.`;
        
        window.open(`https://wa.me/${TELEFONO_DUENO}?text=${encodeURIComponent(mensajeAdmin)}`, '_blank');
        
        buscarMisCitas(cita.telefono);
      }
    } catch (err) {
      alert("Error al procesar la cancelación.");
    }
  };

  const guardarReprogramacion = async (cita) => {
    if (!nuevaFecha) {
      alert("Por favor selecciona una fecha.");
      return;
    }

    if (nuevaFecha < hoy || nuevaFecha > maxAnioStr) {
      alert("Por favor selecciona una fecha válida dentro del rango actual.");
      return;
    }

    // Construcción exacta asegurando que la fecha se envíe con hora local sin desfase UTC
    const fechaCompleta = `${nuevaFecha}T${nuevaHora}:${nuevoMinuto}:00.000Z`;

    try {
      const response = await fetch(`${API_URL}/api/citas/${cita._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fecha: fechaCompleta, 
          estado: 'Pendiente', 
          motivoCancelacion: '' 
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Cita reprogramada con éxito! Queda pendiente de aprobación por la estética.");
        
        const nombreServicio = limpiarServicio(cita.servicio);
        const fechaFormateada = `${nuevaFecha} a las ${nuevaHora}:${nuevoMinuto}`;
        
        const mensajeAdmin = `El cliente ${cita.nombre} reprogramó su cita de ${nombreServicio} para el ${fechaFormateada}. Está Pendiente de revisión.`;
        
        window.open(`https://wa.me/${TELEFONO_DUENO}?text=${encodeURIComponent(mensajeAdmin)}`, '_blank');

        setModoReprogramarId(null);
        buscarMisCitas(cita.telefono);
      } else {
        alert(data.error || "Este horario ya está ocupado.");
      }
    } catch (err) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">Mis Citas</h1>
      <p className="text-stone-600 mb-8">Ingresa tu número de celular para consultar el estado de tus citas, cancelar o reprogramar.</p>

      <form onSubmit={handleSubmitBusqueda} className="bg-stone-50 p-6 rounded-2xl border border-stone-100 shadow-sm mb-8 flex gap-3">
        <input 
          type="tel" required maxLength="10" placeholder="Ingresa tu celular (Ej. 0998765432)"
          value={telefonoBusqueda}
          onChange={(e) => setTelefonoBusqueda(e.target.value.replace(/\D/g, ''))}
          className="flex-1 p-3 rounded-lg border border-stone-200 bg-white outline-none"
        />
        <button type="submit" className="bg-[#8f715e] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#52463e] transition-colors">
          {cargando ? 'Buscando...' : 'Consultar'}
        </button>
      </form>

      {buscado && (
        <div className="space-y-6">
          {citasCliente.length === 0 ? (
            <p className="text-center text-stone-500 py-8 bg-stone-50 rounded-xl border">No se encontraron citas registradas con este número.</p>
          ) : (
            citasCliente.map((cita) => {
              const servicioLimpio = limpiarServicio(cita.servicio);

              return (
              <div key={cita._id} className="bg-stone-600 text-white p-6 rounded-2xl shadow-lg space-y-3">
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <h3 className="text-lg font-bold">{servicioLimpio}</h3>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    cita.estado === 'Confirmado' ? 'bg-emerald-600' : 
                    cita.estado === 'Cancelado' ? 'bg-red-600' : 'bg-amber-500'
                  }`}>
                    {cita.estado}
                  </span>
                </div>

                <p className="text-sm">Cliente: <span className="font-semibold">{cita.nombre}</span></p>
                <p className="text-sm">Fecha programada: <span className="font-semibold">{new Date(cita.fecha).toLocaleString()}</span></p>
                
                {cita.motivoCancelacion && (
                  <div className="bg-red-950/60 p-3 rounded-xl border border-red-800 text-xs text-red-200">
                    <span className="font-bold">Motivo de cancelación:</span> {cita.motivoCancelacion}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-3">
                  {cita.estado !== 'Cancelado' && (
                    <button onClick={() => cancelarCita(cita)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                      Cancelar esta cita
                    </button>
                  )}
                  {cita.estado === 'Cancelado' && modoReprogramarId !== cita._id && (
                    <button onClick={() => setModoReprogramarId(cita._id)} className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                      Reprogramar nueva hora
                    </button>
                  )}
                </div>

                {modoReprogramarId === cita._id && (
                  <div className="mt-4 p-4 bg-stone-800 rounded-xl border border-stone-700 space-y-4">
                    <h4 className="text-sm font-bold text-amber-400">Selecciona tu nuevo horario disponible:</h4>
                    <div>
                      <label className="block text-xs text-stone-300 mb-1">Nueva Fecha</label>
                      <input 
                        type="date" 
                        min={hoy}
                        max={maxAnioStr}
                        value={nuevaFecha}
                        onChange={(e) => setNuevaFecha(e.target.value)}
                        onClick={(e) => {
                          try {
                            if (typeof e.target.showPicker === 'function') {
                              e.target.showPicker();
                            }
                          } catch (err) {}
                        }}
                        style={{ colorScheme: 'dark' }}
                        className="w-full p-3 rounded-xl border border-stone-600 bg-stone-900 text-white outline-none text-sm cursor-pointer shadow-inner [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-300 mb-1">Nueva Hora (Estilo Alarma)</label>
                      <div className="flex items-center gap-2 justify-center">
                        <select 
                          value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)}
                          className="p-2 border border-stone-600 rounded-lg font-bold bg-stone-900 text-white outline-none text-center"
                        >
                          {horasPermitidas.map(h => <option key={h} value={h}>{h} h</option>)}
                        </select>
                        <span className="text-xl font-bold">:</span>
                        <select 
                          value={nuevoMinuto} onChange={(e) => setNuevoMinuto(e.target.value)}
                          className="p-2 border border-stone-600 rounded-lg font-bold bg-stone-900 text-white outline-none text-center"
                        >
                          {minutosPermitidos.map(m => <option key={m} value={m}>{m} min</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => guardarReprogramacion(cita)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
                      >
                        Confirmar Reprogramación
                      </button>
                      <button 
                        onClick={() => setModoReprogramarId(null)}
                        className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
          )}
        </div>
      )}
    </div>
  );
}

export default MisCitas;