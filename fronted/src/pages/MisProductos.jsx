import React, { useState } from 'react';
const API_URL = "https://estetica-g10e.onrender.com";

function MisProductos() {
  const [telefonoBusqueda, setTelefonoBusqueda] = useState('');
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();

    const regexEcuador = /^09\d{8}$/;
    if (!regexEcuador.test(telefonoBusqueda)) {
      alert("Por favor, ingresa un número celular ecuatoriano válido de 10 dígitos que comience con 09.");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/api/pedidos/telefono/${telefonoBusqueda}`);
      const datos = await respuesta.json();

      if (respuesta.ok) {
        setPedidosCliente(datos);
        setBuscado(true);
      } else {
        alert(datos.error || "Error al buscar los productos.");
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-sans">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Mis Compras y Productos</h1>
        <p className="text-stone-600 text-sm">Consulta el estado de tus pedidos, comprobantes y saldos pendientes.</p>
      </div>

      <form onSubmit={handleBuscar} className="bg-stone-50 border border-stone-200 p-6 rounded-2xl shadow-sm max-w-lg mx-auto flex gap-3 mb-10">
        <input 
          type="tel" 
          required 
          maxLength="10" 
          value={telefonoBusqueda} 
          placeholder="Ingresa tu celular (Ej. 0998765432)"
          className="flex-1 p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none"
          onChange={(e) => setTelefonoBusqueda(e.target.value.replace(/\D/g, '').slice(0, 10))}
        />
        <button 
          type="submit" 
          disabled={cargando}
          className="bg-[#3a322d] hover:bg-[#52463e] text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors shadow"
        >
          {cargando ? 'Buscando...' : 'Consultar'}
        </button>
      </form>

      {buscado && (
        <div className="space-y-6">
          {pedidosCliente.length === 0 ? (
            <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200">
              <p className="text-stone-500 text-sm">No encontramos compras registradas con este número de celular.</p>
            </div>
          ) : (
            pedidosCliente.map((pedido) => (
              <div key={pedido._id} className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{pedido.nombreProducto}</h3>
                    <p className="text-xs text-stone-500">Registrado el: {new Date(pedido.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Badge Estado Comprobante / Compra unificado de forma coherente */}
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      pedido.estadoComprobante === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' :
                      pedido.estadoComprobante === 'Rechazado' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pedido.estadoComprobante === 'Aprobado' ? 'Compra Aprobada' :
                       pedido.estadoComprobante === 'Rechazado' ? 'Comprobante Rechazado' : 'Pendiente de Verificación'}
                    </span>
                  </div>
                </div>

                {/* Motivo de rechazo visible solo si fue rechazado */}
                {pedido.estadoComprobante === 'Rechazado' && pedido.motivoRechazo && (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 space-y-1">
                    <p className="font-bold">Motivo del rechazo por parte del administrador:</p>
                    <p>{pedido.motivoRechazo}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-stone-500 block">Precio Total:</span>
                    <span className="font-bold text-stone-900 text-base">${pedido.precioTotal}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Modalidad:</span>
                    <span className="font-bold uppercase text-stone-900">{pedido.tipoPago}</span>
                  </div>
                  {pedido.tipoPago === 'abonos' && (
                    <>
                      <div>
                        <span className="text-stone-500 block">Total Abonado:</span>
                        <span className="font-bold text-emerald-700 text-base">${pedido.totalAbonado || 0}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Saldo Pendiente:</span>
                        <span className="font-bold text-rose-600 text-base">${pedido.saldoPendiente || pedido.precioTotal}</span>
                      </div>
                    </>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MisProductos;