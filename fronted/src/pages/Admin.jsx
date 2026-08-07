import React, { useState, useEffect } from 'react';
const API_URL = "https://estetica-g10e.onrender.com";

function Admin({ catalogo, setCatalogo }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  // Estado para la pestaña activa dentro del admin ("citas", "productos" o "inventario")
  const [seccionActiva, setSeccionActiva] = useState('citas');

  // Estados de datos
  const [citas, setCitas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  
  // Nota: Se elimina el useState local de catalogo para usar el que viene por props de App.jsx

  // Estados locales para el formulario de nuevo producto e inventario rápido
  const [nuevoProducto, setNuevoProducto] = useState({
    categoria: 'perfumes',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
    enOferta: false,
    precioOferta: ''
  });
  const [productoEditando, setProductoEditando] = useState(null);
  const [stockExtra, setStockExtra] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  // Obtener Citas
  const obtenerCitas = async () => {
    try {
     
      const res = await fetch(`${API_URL}/api/citas`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const citasOrdenadas = data.sort((a, b) => {
          const nombreA = a.nombre || "";
          const nombreB = b.nombre || "";
          return nombreA.localeCompare(nombreB);
        });
        setCitas(citasOrdenadas);
      } else {
        setCitas([]);
      }
    } catch (err) {
      console.error("Error al obtener citas:", err);
      setCitas([]);
    }
  };

  // Obtener Pedidos (Panel de Productos)
  const obtenerPedidos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pedidos`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const pedidosOrdenados = data.sort((a, b) => {
          const nombreA = a.nombre || "";
          const nombreB = b.nombre || "";
          return nombreA.localeCompare(nombreB);
        });
        setPedidos(pedidosOrdenados);
      } else {
        setPedidos([]);
      }
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
      setPedidos([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      obtenerCitas();
      obtenerPedidos();
    }
  }, [isAuthenticated]);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem('token', data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.msg || 'Error de acceso');
      }
    } catch {
      setError('Error de conexión con el servidor');
    }
  };

  // Cambiar estado de Cita
  const cambiarEstadoCita = async (id, nuevoEstado, cita) => {
    let motivo = "";
    if (nuevoEstado === 'Cancelado') {
      motivo = prompt("Por favor, ingrese el motivo de la cancelación:");
      if (!motivo) return;
    }

    try {
      const res = await fetch(`${API_URL}/api/citas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado, motivoCancelacion: motivo })
      });

      if (res.ok) {
        setCitas(citas.map(c => c._id === id ? { ...c, estado: nuevoEstado, motivoCancelacion: motivo } : c));

        let fechaFormateada = "fecha por definir";
        try {
          if (cita.fecha) fechaFormateada = new Date(cita.fecha).toLocaleString();
        } catch (e) {
          console.error("Error formateando fecha", e);
        }

        let mensaje = "";
        const nombreCliente = cita.nombre || "Estimado cliente";
        let servicioCliente = "su servicio";
        if (Array.isArray(cita.servicio)) {
          servicioCliente = cita.servicio.join(', ');
        } else if (cita.servicio) {
          servicioCliente = cita.servicio;
        }

        if (nuevoEstado === 'Confirmado') {
          mensaje = `¡Hola ${nombreCliente}! Su cita en Marie Valentina Spa y Estética para ${servicioCliente} a las ${fechaFormateada} fue *aceptada*. ¡Te esperamos!`;
        } else {
          mensaje = `¡Hola ${nombreCliente}! Lamentamos informarle que su cita en Marie Valentina Spa y Estética para ${servicioCliente} a las ${fechaFormateada} fue *cancelada*. Motivo: ${motivo}. Puede reprogramarla cuando guste desde nuestra web.`;
        }

        const telefonoLimpio = cita.telefono ? cita.telefono.replace(/^0/, '') : '';
        const url = `https://wa.me/593${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
      }
    } catch (err) {
      alert("Error al actualizar la cita.");
    }
  };

  // Cambiar estado del comprobante / pedido de productos
  const cambiarEstadoComprobante = async (id, nuevoEstado) => {
    let motivoRechazo = '';
    if (nuevoEstado === 'Rechazado') {
      motivoRechazo = prompt('Ingrese el motivo del rechazo del comprobante:') || 'Comprobante no válido';
    }

    try {
      const res = await fetch(`${API_URL}/api/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoComprobante: nuevoEstado, motivoRechazo })
      });

      if (res.ok) {
        obtenerPedidos();
      } else {
        alert('Error al actualizar el estado del comprobante');
      }
    } catch (err) {
      alert('Error de conexión al actualizar el comprobante');
    }
  };

  // Funciones para la Gestión de Inventario
  const handleSumarStock = (categoria, id) => {
    const cantidad = parseInt(stockExtra);
    if (!cantidad || cantidad <= 0) {
      alert("Ingresa una cantidad válida para reponer stock.");
      return;
    }

    setCatalogo((prevCatalogo) => ({
      ...prevCatalogo,
      [categoria]: prevCatalogo[categoria].map(prod => 
        prod.id === id ? { ...prod, stock: prod.stock + cantidad } : prod
      )
    }));
    
    setProductoEditando(null);
    setStockExtra('');
    alert("¡Stock actualizado con éxito!");
  };

  const handleCrearProducto = (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const productoFinal = {
      id: Date.now(),
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      precio: parseFloat(nuevoProducto.precio),
      stock: parseInt(nuevoProducto.stock),
      imagen: nuevoProducto.imagen || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
      enOferta: nuevoProducto.enOferta,
      precioOferta: nuevoProducto.enOferta ? parseFloat(nuevoProducto.precioOferta) : null
    };

    setCatalogo((prevCatalogo) => {
      const nuevaCategoria = [...(prevCatalogo[nuevoProducto.categoria] || []), productoFinal];
      return { 
        ...prevCatalogo, 
        [nuevoProducto.categoria]: nuevaCategoria 
      };
    });

    alert("¡Producto nuevo añadido al inventario con éxito!");
    
    setNuevoProducto({
      categoria: 'perfumes',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen: '',
      enOferta: false,
      precioOferta: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xl max-w-sm w-full text-center space-y-4">
          <h2 className="text-xl font-bold">Admin Marie Valentina</h2>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <form onSubmit={manejarLogin} className="space-y-3">
            <input
              type="text"
              placeholder="Usuario"
              value={usernameInput}
              onChange={e => setUsernameInput(e.target.value)}
              className="w-full border p-3 rounded-xl outline-none"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full border p-3 rounded-xl outline-none"
            />
            <button type="submit" className="w-full bg-stone-950 text-white py-3 rounded-xl font-bold hover:bg-stone-800">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Cabecera del Panel Admin con Pestañas de Navegación Interna */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold">Panel de Administración</h2>
          <p className="text-sm text-stone-500">Marie Valentina Spa y Estética</p>
        </div>

        {/* Botones de navegación internos */}
        <div className="flex items-center gap-3">
          <div className="bg-stone-100 p-1 rounded-xl flex gap-1 border">
            <button
              onClick={() => setSeccionActiva('citas')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                seccionActiva === 'citas' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📅 Citas
            </button>
            <button
              onClick={() => setSeccionActiva('productos')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                seccionActiva === 'productos' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📦 Compras y Pedidos
            </button>
            <button
              onClick={() => setSeccionActiva('inventario')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                seccionActiva === 'inventario' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏷️ Stock e Inventario
            </button>
          </div>

          <button
            onClick={() => { sessionStorage.removeItem('token'); setIsAuthenticated(false); }}
            className="text-sm underline text-stone-500 hover:text-stone-900 ml-2"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: PANEL DE CITAS */}
      {seccionActiva === 'citas' && (
        <div>
          <h3 className="text-xl font-bold mb-4">Gestión de Citas (A-Z)</h3>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b">
                  <th className="p-4">Cliente (A-Z)</th>
                  <th className="p-4">Servicios & Foto</th>
                  <th className="p-4">Fecha y Hora</th>
                  <th className="p-4">Estado / Motivo</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {citas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-stone-400">No hay citas registradas.</td>
                  </tr>
                ) : (
                  citas.map((cita) => {
                    let fechaTexto = "Fecha inválida";
                    try {
                      if (cita.fecha) fechaTexto = new Date(cita.fecha).toLocaleString();
                    } catch (e) {
                      fechaTexto = "Fecha no disponible";
                    }

                    let textoServicios = "Sin servicio";
                    if (Array.isArray(cita.servicio)) {
                      textoServicios = cita.servicio.join(', ');
                    } else if (cita.servicio) {
                      textoServicios = cita.servicio;
                    }

                    return (
                      <tr key={cita._id || Math.random()} className="hover:bg-stone-50">
                        <td className="p-4">
                          <p className="font-bold">{cita.nombre || "Sin nombre"}</p>
                          {cita.telefono && (
                            <a
                              href={`https://wa.me/593${cita.telefono.replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-600 underline"
                            >
                              📱 {cita.telefono}
                            </a>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{textoServicios}</p>
                          {cita.imagen && (
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const win = window.open();
                                  win.document.write(`<iframe src="${cita.imagen}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
                                }}
                                className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              >
                                🖼️ Ver foto de referencia
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-4">{fechaTexto}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            cita.estado === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' :
                            cita.estado === 'Cancelado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {cita.estado || 'Pendiente'}
                          </span>
                          {cita.motivoCancelacion && <p className="text-xs text-red-600 mt-1">Motivo: {cita.motivoCancelacion}</p>}
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button
                            onClick={() => cambiarEstadoCita(cita._id, 'Confirmado', cita)}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700"
                          >
                            ✓ Confirmar
                          </button>
                          <button
                            onClick={() => cambiarEstadoCita(cita._id, 'Cancelado', cita)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600"
                          >
                            ✕ Cancelar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: PANEL DE PRODUCTOS / PEDIDOS - MARIE VALENTINA */}
      {seccionActiva === 'productos' && (
        <div>
          <h3 className="text-xl font-bold mb-4">Panel de Pedidos y Compras - Marie Valentina</h3>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b">
                  <th className="p-4">Fecha y Hora</th>
                  <th className="p-4">Cliente (A-Z) & Teléfono</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Modalidad & Método</th>
                  <th className="p-4">Valores ($)</th>
                  <th className="p-4">Comprobante</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-stone-400">No hay pedidos o compras registradas.</td>
                  </tr>
                ) : (
                  pedidos.map((pedido) => {
                    let fechaCreacionTexto = "Fecha no disponible";
                    try {
                      const fechaBase = pedido.fechaCreacion || pedido.createdAt;
                      if (fechaBase) fechaCreacionTexto = new Date(fechaBase).toLocaleString();
                    } catch (e) {
                      fechaCreacionTexto = "Fecha inválida";
                    }

                    return (
                      <tr key={pedido._id || Math.random()} className="hover:bg-stone-50">
                        <td className="p-4 text-xs text-stone-600">
                          {fechaCreacionTexto}
                        </td>
                        <td className="p-4">
                          <p className="font-bold">{pedido.nombre || "Sin nombre"}</p>
                          {pedido.telefono && (
                            <a
                              href={`https://wa.me/593${pedido.telefono.replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-600 underline"
                            >
                              📱 {pedido.telefono}
                            </a>
                          )}
                        </td>
                        <td className="p-4 font-semibold text-stone-800">
                          {pedido.nombreProducto || "Producto General"}
                        </td>
                        <td className="p-4 text-xs space-y-1">
                          <div><span className="font-bold">Método:</span> {pedido.metodoPago}</div>
                          <div><span className="font-bold">Tipo:</span> {pedido.tipoPago}</div>
                        </td>
                        <td className="p-4 text-xs">
                          <div>Total: <strong>${pedido.precioTotal}</strong></div>
                          {pedido.tipoPago === 'abonos' && (
                            <div className="text-emerald-700 mt-1">
                              Abonado: ${pedido.totalAbonado || 0}<br />
                              Pendiente: ${pedido.saldoPendiente || 0}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {pedido.comprobanteUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                const win = window.open();
                                win.document.write(`<iframe src="${pedido.comprobanteUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
                              }}
                              className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                            >
                              🖼️ Ver Comprobante
                            </button>
                          ) : (
                            <span className="text-xs text-stone-400 italic">Pago Físico (Sin comprobante)</span>
                          )}
                        </td>
                        <td className="p-4 text-xs space-y-1">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-stone-100 font-bold text-stone-700">
                              Compra: {pedido.estadoCompra}
                            </span>
                          </div>
                          {pedido.metodoPago === 'transferencia' && (
                            <div>
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                pedido.estadoComprobante === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' :
                                pedido.estadoComprobante === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                Comprobante: {pedido.estadoComprobante || 'Pendiente'}
                              </span>
                            </div>
                          )}
                          {pedido.motivoRechazo && (
                            <p className="text-red-500 text-[11px]">Rechazo: {pedido.motivoRechazo}</p>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {pedido.metodoPago === 'transferencia' && pedido.estadoComprobante === 'Pendiente' ? (
                            <div className="flex flex-col gap-1.5 justify-center">
                              <button
                                onClick={() => cambiarEstadoComprobante(pedido._id, 'Aprobado')}
                                className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-emerald-700"
                              >
                                ✓ Aprobar
                              </button>
                              <button
                                onClick={() => cambiarEstadoComprobante(pedido._id, 'Rechazado')}
                                className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-red-600"
                              >
                                ✕ Rechazar
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400">Revisado / Físico</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: GESTIÓN DE STOCK E INVENTARIO */}
      {seccionActiva === 'inventario' && (
        <div className="space-y-12">
          <div className="border-b pb-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">Panel de Control de Inventario y Stock</h3>
            <p className="text-xs text-stone-500">Gestiona existencias, precios de oferta y añade nuevos artículos al catálogo.</p>
          </div>

          {/* Formulario de Nuevo Producto */}
          <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl shadow-sm space-y-6">
            <h4 className="text-base font-bold text-stone-900 font-serif">Añadir Nuevo Producto</h4>
            
            <form onSubmit={handleCrearProducto} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Categoría</label>
                <select 
                  value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none font-semibold"
                >
                  <option value="perfumes">Perfumes</option>
                  <option value="cremas">Cremas</option>
                  <option value="joyeria">Joyería</option>
                  <option value="ceramicas">Cerámicas</option>
                  <option value="tejidos">Tejidos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Producto</label>
                <input 
                  type="text" required placeholder="Ej. Serum Facial Antiedad"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Descripción</label>
                <input 
                  type="text" placeholder="Detalles o ingredientes del producto..."
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Precio Normal ($)</label>
                <input 
                  type="number" step="0.01" required placeholder="Ej. 35.00"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Stock Inicial</label>
                <input 
                  type="number" required placeholder="Ej. 10"
                  value={nuevoProducto.stock}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">URL de la Imagen</label>
                <input 
                  type="text" placeholder="https://images.unsplash.com/..."
                  value={nuevoProducto.imagen}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, imagen: e.target.value})}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none"
                />
              </div>

              {/* Opción de Oferta */}
              <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" id="enOfertaCheck"
                    checked={nuevoProducto.enOferta}
                    onChange={(e) => setNuevoProducto({...nuevoProducto, enOferta: e.target.checked})}
                    className="w-4 h-4 accent-[#3a322d]"
                  />
                  <label htmlFor="enOfertaCheck" className="text-xs font-bold text-stone-800 uppercase tracking-wider cursor-pointer">
                    ¿Este producto está en oferta / descuento?
                  </label>
                </div>

                {nuevoProducto.enOferta && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nuevo Precio de Oferta ($)</label>
                    <input 
                      type="number" step="0.01" placeholder="Ej. 25.00"
                      value={nuevoProducto.precioOferta}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, precioOferta: e.target.value})}
                      className="w-full p-3 rounded-xl border border-amber-300 bg-amber-50/50 text-sm outline-none font-bold text-amber-900"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <button 
                  type="submit"
                  className="w-full bg-[#3a322d] hover:bg-[#52463e] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Publicar Producto en la Tienda
                </button>
              </div>
            </form>
          </div>

          {/* Listado de Seguimiento de Stock Actual */}
          <div className="space-y-6">
            <h4 className="text-base font-bold text-stone-900 font-serif">Seguimiento de Stock por Categoría</h4>

            {Object.entries(catalogo).map(([categoria, productos]) => (
              <div key={categoria} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h5 className="text-xs font-bold text-[#a37f5a] uppercase tracking-wider">{categoria}</h5>

                {productos.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No hay productos registrados en esta categoría aún.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productos.map((prod) => (
                      <div key={prod.id} className="bg-stone-50 border border-stone-100 p-4 rounded-xl flex flex-col justify-between space-y-3">
                        <div className="flex gap-3 items-center">
                          <img src={prod.imagen} alt={prod.nombre} className="w-12 h-12 object-cover rounded-lg shrink-0 bg-white" />
                          <div>
                            <h6 className="font-bold text-stone-900 text-sm leading-tight">{prod.nombre}</h6>
                            <div className="flex items-center gap-2 mt-1">
                              {prod.enOferta ? (
                                <>
                                  <span className="text-xs font-bold text-amber-700">${prod.precioOferta}</span>
                                  <span className="text-[10px] text-stone-400 line-through">${prod.precio}</span>
                                </>
                              ) : (
                                <span className="text-xs font-bold text-stone-900">${prod.precio}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-xs">
                          <span className={`font-bold px-2.5 py-0.5 rounded-full ${prod.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            Stock: {prod.stock}
                          </span>

                          <button
                            onClick={() => setProductoEditando(prod.id)}
                            className="text-xs font-bold text-[#a37f5a] hover:underline"
                          >
                            + Añadir Stock
                          </button>
                        </div>

                        {/* Input rápido para reponer stock */}
                        {productoEditando === prod.id && (
                          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex gap-2 items-center mt-2">
                            <input 
                              type="number" placeholder="Cantidad" 
                              value={stockExtra} 
                              onChange={(e) => setStockExtra(e.target.value)}
                              className="w-20 p-1.5 text-xs bg-white border rounded outline-none"
                            />
                            <button 
                              onClick={() => handleSumarStock(categoria, prod.id)}
                              className="bg-[#3a322d] text-white px-3 py-1.5 rounded text-xs font-bold"
                            >
                              Guardar
                            </button>
                            <button 
                              onClick={() => setProductoEditando(null)}
                              className="text-stone-500 text-xs font-bold px-1"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Admin;