import React, { useState, useEffect } from 'react';
const API_URL = "https://estetica-g10e.onrender.com";
const TELEFONO_DUENO = "593961360883";

function Agenda() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    servicio: ['Corte de cabello'],
    detalle: '',
    imagen: '',
    fecha: '',
    hora: '09',
    minuto: '00'
  });

  const [citaActiva, setCitaActiva] = useState(null);
  const [modoReprogramar, setModoReprogramar] = useState(false);
  const [buscando, setBuscando] = useState(false);

  // Lista completa de todos los servicios indicados
  const serviciosDisponibles = [
    "Corte de cabello",
    "Tintes de cabello",
    "Ondulados de cabello",
    "Peinados",
    "Laminado de cejas",
    "Tinte de cejas",
    "lifting de pestañas",
    "Pedicura",
    "Manicura",
    "Limpieza facial",
    "Maquillaje"
  ];

  const hoy = new Date().toISOString().split('T')[0];
  const horasPermitidas = ['09', '10', '11', '12', '14', '15', '16', '17', '18'];
  const minutosPermitidos = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const limpiarServicio = (servicio) => {
    if (!servicio) return "Servicio general";
    if (Array.isArray(servicio)) {
      return servicio.join(', ');
    }
    return servicio;
  };

  const buscarCitaPorTelefono = async (tel) => {
    setBuscando(true);
    try {
      const res = await fetch(`${API_URL}/api/citas`);
      const citas = await res.json();
      if (Array.isArray(citas)) {
        const citaEncontrada = citas
          .filter(c => c.telefono === tel)
          .pop();

        if (citaEncontrada) {
          setCitaActiva(citaEncontrada);
        }
      }
    } catch (err) {
      console.error("Error buscando cita", err);
    }
    setBuscando(false);
  };

  useEffect(() => {
    const telGuardado = localStorage.getItem('marie_telefono_cliente');
    if (telGuardado) {
      setFormData(prev => ({ ...prev, telefono: telGuardado }));
      buscarCitaPorTelefono(telGuardado);
    }
  }, []);

  const manejarImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imagen: reader.result }));
      reader.readAsDataURL(archivo);
    }
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de horario
    const h = parseInt(formData.hora);
    if (h < 9 || h >= 18 || h === 13) {
        alert("Lo sentimos, solo atendemos de 09:00 a 18:00 (excepto 13:00).");
        return;
    }

    const regexEcuador = /^09\d{8}$/;
    const telAUsar = modoReprogramar ? citaActiva.telefono : formData.telefono;

    if (!regexEcuador.test(telAUsar)) {
      alert("Ingresa un número de celular ecuatoriano válido de 10 dígitos (empieza con 09).");
      return;
    }

    const horaSeleccionada = `${formData.hora}:${formData.minuto}`;
    const fechaCompleta = `${formData.fecha}T${horaSeleccionada}:00`;

    try {
      const endpoint = modoReprogramar && citaActiva 
        ? `${API_URL}/api/citas/${citaActiva._id}` 
        : `${API_URL}/api/citas`;
      
      const method = modoReprogramar ? 'PUT' : 'POST';
      const bodyData = modoReprogramar 
        ? { 
            fecha: fechaCompleta, 
            estado: 'Pendiente', 
            motivoCancelacion: '',
            detalle: formData.detalle,
            imagen: formData.imagen
          } 
        : { ...formData, fecha: fechaCompleta };

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        const fechaFormateada = new Date(fechaCompleta).toLocaleString();

        if (modoReprogramar) {
          alert("¡Cita reprogramada con éxito en la web! Queda pendiente de aprobación.");
          
          const nombreServicio = limpiarServicio(citaActiva.servicio);
          const mensajeAdmin = `El cliente ${citaActiva.nombre} ha reprogramado su cita de ${nombreServicio} para el ${fechaFormateada}. Está Pendiente.`;
          window.location.href = `https://wa.me/${TELEFONO_DUENO}?text=${encodeURIComponent(mensajeAdmin)}`;

          setCitaActiva(data.cita || { ...citaActiva, fecha: fechaCompleta, estado: 'Pendiente', motivoCancelacion: '' });
          setModoReprogramar(false);
        } else {
          alert("¡Cita agendada con éxito!");
          setCitaActiva(data.nuevaCita || data);
          localStorage.setItem('marie_telefono_cliente', formData.telefono);

          const nombreServicio = limpiarServicio(formData.servicio);
          const mensajeAdmin = `El cliente ${formData.nombre} acaba de hacer su cita para el/los servicio(s) de ${nombreServicio} a la fecha y hora: ${fechaFormateada}.`;
          
          window.location.href = `https://wa.me/${TELEFONO_DUENO}?text=${encodeURIComponent(mensajeAdmin)}`;
        }
      } else {
        alert(data.error || "Error al procesar la solicitud.");
      }
    } catch (error) {
      alert("No se pudo conectar al servidor.");
    }
  };

  const cancelarCitaCliente = async () => {
    if (!citaActiva) return;
    const motivo = prompt("Por favor, ingresa el motivo de tu cancelación:");
    if (!motivo) return;

    try {
      const response = await fetch(`${API_URL}/api/citas/${citaActiva._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Cancelado', motivoCancelacion: motivo })
      });

      const data = await response.json();
      if (response.ok) {
        setCitaActiva(data.cita);
        alert("Has cancelado tu cita correctamente en el sistema.");

        const nombreServicio = limpiarServicio(citaActiva.servicio);
        const mensajeAdmin = `El cliente ${citaActiva.nombre} ha cancelado su cita de ${nombreServicio}. Motivo: ${motivo}.`;
        window.location.href = `https://wa.me/${TELEFONO_DUENO}?text=${encodeURIComponent(mensajeAdmin)}`;
      }
    } catch (err) {
      alert("Error al conectar con el servidor.");
    }
  };

  const cerrarSesionCliente = () => {
    localStorage.removeItem('marie_telefono_cliente');
    setCitaActiva(null);
    setModoReprogramar(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">Agenda tu cita</h1>
          <p className="text-stone-600 text-sm">Marie Valentina Spa y Estética</p>
        </div>
        {citaActiva && (
          <button 
            onClick={cerrarSesionCliente} 
            className="text-xs underline text-stone-500 hover:text-stone-900"
          >
            Registrar otra cita
          </button>
        )}
      </div>

      {citaActiva && !modoReprogramar && (
        <div className="mb-8 bg-stone-900 text-white p-6 rounded-2xl shadow-lg space-y-3">
          <div className="flex justify-between items-center border-b border-stone-800 pb-2">
            <h3 className="text-lg font-bold">Estado de tu Cita</h3>
            <span className={`px-2.5 py-1 rounded text-xs font-bold ${
              citaActiva.estado === 'Confirmado' ? 'bg-emerald-600' : 
              citaActiva.estado === 'Cancelado' ? 'bg-red-600' : 'bg-amber-600'
            }`}>
              {citaActiva.estado}
            </span>
          </div>

          <p className="text-sm">Cliente: <span className="font-semibold">{citaActiva.nombre}</span></p>
          <p className="text-sm">Servicio: <span className="font-semibold">{limpiarServicio(citaActiva.servicio)}</span></p>
          <p className="text-sm">Fecha y Hora: <span className="font-semibold">{new Date(citaActiva.fecha).toLocaleString()}</span></p>
          
          {citaActiva.motivoCancelacion && (
            <div className="bg-red-950/60 p-3 rounded-xl border border-red-800 text-xs text-red-200">
              <span className="font-bold">Motivo de cancelación:</span> {citaActiva.motivoCancelacion}
            </div>
          )}

          <div className="flex gap-3 pt-3">
            {citaActiva.estado !== 'Cancelado' && (
              <button onClick={cancelarCitaCliente} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                Cancelar cita
              </button>
            )}
            {citaActiva.estado === 'Cancelado' && (
              <button onClick={() => setModoReprogramar(true)} className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                Reprogramar nueva hora aquí
              </button>
            )}
          </div>
        </div>
      )}

      {buscando ? (
        <div className="text-center py-10 text-stone-500">Buscando tus citas previas...</div>
      ) : (!citaActiva || modoReprogramar) && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-stone-50 p-8 rounded-2xl border border-stone-100 shadow-sm">
          <h2 className="text-xl font-bold text-stone-800">
            {modoReprogramar ? `Reprogramar cita para ${citaActiva.nombre}` : 'Nueva Cita'}
          </h2>

          {!modoReprogramar && (
            <>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Nombre completo</label>
                <input 
                  type="text" required value={formData.nombre} placeholder="Ej. Mariana Pérez"
                  className="w-full p-3 rounded-lg border border-stone-200 bg-white outline-none"
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Celular (Ecuador) - Te servirá para ver tu cita luego</label>
                <input 
                  type="tel" required maxLength="10" value={formData.telefono} placeholder="Ej. 0998765432"
                  className="w-full p-3 rounded-lg border border-stone-200 bg-white outline-none"
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Selecciona tus servicios:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serviciosDisponibles.map(s => (
                    <label key={s} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.servicio.includes(s)}
                        onChange={(e) => {
                          const nuevosServicios = e.target.checked 
                            ? [...formData.servicio, s] 
                            : formData.servicio.filter(item => item !== s);
                          setFormData({ ...formData, servicio: nuevosServicios });
                        }}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CUADRO DE DESCRIPCIÓN Y FOTO: Siempre visible fuera del condicional de servicios */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-3">
            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1">Detalles de tu estilo o requerimiento</label>
              <textarea 
                rows="3" value={formData.detalle} placeholder="Especificaciones..."
                className="w-full p-3 rounded-lg border border-stone-200 bg-white outline-none text-sm"
                onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1">Foto de referencia</label>
              <input type="file" accept="image/*" onChange={manejarImagen} className="w-full text-sm text-stone-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Fecha</label>
            <input 
              type="date" required min={hoy} value={formData.fecha}
              className="w-full p-3 rounded-lg border border-stone-200 bg-white outline-none"
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Hora de la cita</label>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 justify-center shadow-inner">
              <select 
                value={formData.hora} 
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="p-3 border rounded-xl font-bold text-xl bg-stone-50 outline-none text-center w-24"
              >
                {horasPermitidas.map(h => <option key={h} value={h}>{h} h</option>)}
              </select>
              <span className="text-2xl font-bold">:</span>
              <select 
                value={formData.minuto} 
                onChange={(e) => setFormData({ ...formData, minuto: e.target.value })}
                className="p-3 border rounded-xl font-bold text-xl bg-stone-50 outline-none text-center w-24"
              >
                {minutosPermitidos.map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#3a322d] text-white py-4 rounded-xl font-bold hover:bg-[#52463e] transition-colors shadow-md">
            {modoReprogramar ? 'Guardar Nueva Fecha' : 'Confirmar Solicitud'}
          </button>

          {modoReprogramar && (
            <button type="button" onClick={() => setModoReprogramar(false)} className="w-full text-center text-xs text-stone-500 underline mt-2">
              Cancelar
            </button>
          )}
        </form>
      )}
    </div>
  );
}

export default Agenda;