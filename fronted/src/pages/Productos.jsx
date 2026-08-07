import React, { useState } from 'react';
const API_URL = "https://estetica-g10e.onrender.com";

function Productos({ catalogo, setCatalogo }) {
  const [categoriaActiva, setCategoriaActiva] = useState('perfumes');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  // Estados para el formulario de compra
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoPago, setTipoPago] = useState('contado'); // 'contado' o 'abonos'
  const [metodoPago, setMetodoPago] = useState('transferencia'); // 'transferencia' o 'fisico'
  const [montoAbono, setMontoAbono] = useState('');
  const [numeroCuotas, setNumeroCuotas] = useState(2); // Máximo 6 cuotas de abono
  const [comprobante, setComprobante] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');

  // Normalizar el monto para aceptar comas o puntos (ej. 22,5 o 22.5)
  const normalizarMonto = (valor) => {
    return parseFloat(valor.replace(',', '.'));
  };

  // Convertir imagen a Base64 para enviarla al backend
  const manejarComprobante = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenBase64(reader.result);
        setComprobante(archivo.name);
      };
      reader.readAsDataURL(archivo);
    }
  };

  // Procesar la compra y enviar al backend + WhatsApp
  const handleSubmitCompra = async (e) => {
    e.preventDefault();

    // Validación estricta de celular ecuatoriano (10 dígitos, empieza con 09)
    const regexEcuador = /^09\d{8}$/;
    if (!regexEcuador.test(telefono)) {
      alert("Por favor, ingresa un número celular ecuatoriano válido de 10 dígitos que comience con 09.");
      return;
    }

    let montoNumerico = 0;
    if (tipoPago === 'abonos') {
      montoNumerico = normalizarMonto(montoAbono);

      if (!montoAbono || isNaN(montoNumerico) || montoNumerico >= productoSeleccionado.precio) {
        alert("El monto del abono inicial debe ser menor al precio total del producto y tener un valor válido.");
        return;
      }
      if (numeroCuotas > 6) {
        alert("El número máximo de abonos permitidos es 6.");
        return;
      }
    }

    const fechaActual = new Date().toLocaleDateString();

    try {
      const datosCompra = {
        nombre,
        telefono,
        productoId: productoSeleccionado.id,
        nombreProducto: productoSeleccionado.nombre,
        precioTotal: productoSeleccionado.precio,
        imagen: productoSeleccionado.imagen,
        tipoPago,
        metodoPago,
        comprobanteUrl: metodoPago === 'transferencia' ? imagenBase64 : '',
        montoPrimerAbono: tipoPago === 'abonos' ? montoNumerico : 0,
        numeroDeAbonos: tipoPago === 'abonos' ? Number(numeroCuotas) : 1
      };

      const respuesta = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompra)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        // Actualizar el stock localmente restando 1 unidad al producto comprado
        setCatalogo((prevCatalogo) => {
          const updatedCategoria = prevCatalogo[categoriaActiva].map((prod) => {
            if (prod.id === productoSeleccionado.id) {
              return { ...prod, stock: Math.max(0, prod.stock - 1) };
            }
            return prod;
          });
          return { ...prevCatalogo, [categoriaActiva]: updatedCategoria };
        });

        alert("¡Compra registrada con éxito!");

        let mensajeWhatsApp = "";
        if (tipoPago === 'abonos') {
          mensajeWhatsApp = `El cliente ${nombre} en la fecha ${fechaActual} acaba de comprar por abonos de $${montoAbono} (${numeroCuotas} cuotas máx) el producto ${productoSeleccionado.nombre} que cuesta $${productoSeleccionado.precio} por medio de ${metodoPago}.`;
        } else if (metodoPago === 'transferencia') {
          mensajeWhatsApp = `El cliente ${nombre} en la fecha ${fechaActual} acaba de comprar el producto ${productoSeleccionado.nombre} que cuesta $${productoSeleccionado.precio} por medio de transferencia.`;
        } else {
          mensajeWhatsApp = `El cliente ${nombre} en la fecha ${fechaActual} acaba de comprar el producto ${productoSeleccionado.nombre} que cuesta $${productoSeleccionado.precio} y pagará por medio de dinero físico.`;
        }

        window.open(`https://wa.me/593961360883?text=${encodeURIComponent(mensajeWhatsApp)}`, '_blank');

        // Limpiar formulario y cerrar modal
        setProductoSeleccionado(null);
        setNombre('');
        setTelefono('');
        setMontoAbono('');
        setNumeroCuotas(2);
        setComprobante('');
        setImagenBase64('');
      } else {
        alert(resultado.error || "Error al procesar la compra.");
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    }
  };

  // Validar si la categoría actual tiene productos en el catálogo compartido
  const listaProductos = catalogo[categoriaActiva] || [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 font-sans">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-serif font-bold text-stone-900">Marie Valentina - Tienda</h1>
        <p className="text-stone-600 text-sm">Explora nuestra exclusiva selección de productos</p>
      </div>

      {/* MENÚ DE CATEGORÍAS */}
      <div className="flex justify-center gap-2 md:gap-4 mb-10 overflow-x-auto pb-2">
        {['perfumes', 'cremas', 'joyeria', 'ceramicas', 'tejidos'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
              categoriaActiva === cat 
                ? 'bg-[#3a322d] text-white shadow-md' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listaProductos.length === 0 ? (
          <p className="col-span-full text-center text-stone-500 py-8">No hay productos disponibles en esta categoría.</p>
        ) : (
          listaProductos.map((prod) => (
            <div key={prod.id} className="bg-stone-50 border border-stone-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              
              {/* IMAGEN DEL PRODUCTO */}
              <div className="h-52 w-full bg-white p-4 overflow-hidden relative flex items-center justify-center border-b border-stone-100">
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="text-[11px] bg-stone-900/80 text-white font-bold px-2.5 py-1 rounded-full shadow-xs">
                    Stock: {prod.stock}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-stone-900">{prod.nombre}</h3>
                  <p className="text-stone-600 text-sm">{prod.descripcion}</p>
                </div>
                
                <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-xl font-serif font-bold text-[#3a322d]">${prod.precio}</span>
                  {prod.stock > 0 ? (
                    <button
                      onClick={() => setProductoSeleccionado(prod)}
                      className="bg-[#3a322d] hover:bg-[#52463e] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow"
                    >
                      Comprar
                    </button>
                  ) : (
                    <span className="text-xs text-red-500 font-bold">Agotado</span>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL DE FORMULARIO DE COMPRA */}
      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-xl font-bold font-serif text-stone-900">Comprar Producto</h2>
                <p className="text-xs text-[#a37f5a] font-semibold">{productoSeleccionado.nombre} - ${productoSeleccionado.precio}</p>
              </div>
              <button onClick={() => setProductoSeleccionado(null)} className="text-stone-400 hover:text-stone-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitCompra} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" required value={nombre} placeholder="Ej. María Chango"
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none"
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Celular (Ecuador - 10 dígitos, empieza con 09)</label>
                <input 
                  type="tel" required maxLength="10" value={telefono} placeholder="Ej. 0998765432"
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none"
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Modalidad de Pago</label>
                  <select 
                    value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none font-semibold"
                  >
                    <option value="contado">Pago de una</option>
                    <option value="abonos">En Abonos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Método de Pago</label>
                  <select 
                    value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none font-semibold"
                  >
                    <option value="transferencia">Transferencia</option>
                    <option value="fisico">Pago Físico (Local)</option>
                  </select>
                </div>
              </div>

              {tipoPago === 'abonos' && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Monto de este Abono Inicial ($)</label>
                    <input 
                      type="text" required value={montoAbono} placeholder="Ej. 22,5 o 22.5"
                      className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none font-bold"
                      onChange={(e) => {
                        const valor = e.target.value.replace(/[^0-9.,]/g, '');
                        setMontoAbono(valor);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Cantidad de Abonos (Máximo 6)</label>
                    <select 
                      value={numeroCuotas} 
                      onChange={(e) => setNumeroCuotas(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-white text-sm outline-none font-bold"
                    >
                      {[2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} abonos en total</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-stone-500">Podrás seguir abonando el resto desde tu sección "Mis Productos".</p>
                </div>
              )}

              {metodoPago === 'transferencia' && (
                <div className="bg-stone-100 p-4 rounded-xl space-y-3">
                  <div className="text-xs text-stone-700 space-y-1">
                    <p className="font-bold text-stone-900">Datos de la Cuenta del Dueño:</p>
                    <p>Banco: Pichincha | Cuenta Ahorros: 220XXXXXXX</p>
                    <p>Titular: Marie Valentina | CI: 171XXXXXXX</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">Subir Comprobante (Obligatorio)</label>
                    <input 
                      type="file" accept="image/*" required onChange={manejarComprobante}
                      className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3a322d] file:text-white hover:file:bg-[#52463e]"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#3a322d] hover:bg-[#52463e] text-white py-4 rounded-xl font-bold text-sm transition-colors shadow-md"
              >
                Confirmar Compra
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;