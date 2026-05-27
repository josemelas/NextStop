"use client";

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, MoreHorizontal, Edit2, Trash2, Loader2, ArrowLeft, Users, DollarSign } from 'lucide-react';

const FILAS_AVION = [
  { numero: 1, asientos: [{ id: '1A', tipo: 'PREMIUM' }, { id: '1B', tipo: 'PREMIUM' }, { id: '1C', tipo: 'PREMIUM' }, { id: '1D', tipo: 'PREMIUM' }, { id: '1E', tipo: 'PREMIUM' }, { id: '1F', tipo: 'PREMIUM' }] },
  { numero: 2, asientos: [{ id: '2A', tipo: 'PREMIUM' }, { id: '2B', tipo: 'PREMIUM' }, { id: '2C', tipo: 'PREMIUM' }, { id: '2D', tipo: 'PREMIUM' }, { id: '2E', tipo: 'PREMIUM' }, { id: '2F', tipo: 'PREMIUM' }] },
  { numero: 3, asientos: [{ id: '3A', tipo: 'PREMIUM' }, { id: '3B', tipo: 'PREMIUM' }, { id: '3C', tipo: 'PREMIUM' }, { id: '3D', tipo: 'PREMIUM' }, { id: '3E', tipo: 'PREMIUM' }, { id: '3F', tipo: 'PREMIUM' }] },
  { numero: 4, asientos: [{ id: '4A', tipo: 'DISPONIBLE' }, { id: '4B', tipo: 'DISPONIBLE' }, { id: '4C', tipo: 'DISPONIBLE' }, { id: '4D', tipo: 'DISPONIBLE' }, { id: '4E', tipo: 'DISPONIBLE' }, { id: '4F', tipo: 'DISPONIBLE' }] },
  { numero: 5, asientos: [{ id: '5A', tipo: 'DISPONIBLE' }, { id: '5B', tipo: 'DISPONIBLE' }, { id: '5C', tipo: 'DISPONIBLE' }, { id: '5D', tipo: 'DISPONIBLE' }, { id: '5E', tipo: 'DISPONIBLE' }, { id: '5F', tipo: 'DISPONIBLE' }] },
  { numero: 6, asientos: [{ id: '6A', tipo: 'DISPONIBLE' }, { id: '6B', tipo: 'DISPONIBLE' }, { id: '6C', tipo: 'DISPONIBLE' }, { id: '6D', tipo: 'DISPONIBLE' }, { id: '6E', tipo: 'DISPONIBLE' }, { id: '6F', tipo: 'DISPONIBLE' }] },
  { numero: 7, asientos: [{ id: '7A', tipo: 'DISPONIBLE' }, { id: '7B', tipo: 'DISPONIBLE' }, { id: '7C', tipo: 'DISPONIBLE' }, { id: '7D', tipo: 'DISPONIBLE' }, { id: '7E', tipo: 'DISPONIBLE' }, { id: '7F', tipo: 'DISPONIBLE' }] },
  { numero: 8, asientos: [{ id: '8A', tipo: 'DISPONIBLE' }, { id: '8B', tipo: 'DISPONIBLE' }, { id: '8C', tipo: 'DISPONIBLE' }, { id: '8D', tipo: 'DISPONIBLE' }, { id: '8E', tipo: 'DISPONIBLE' }, { id: '8F', tipo: 'DISPONIBLE' }] },
  { numero: 9, asientos: [{ id: '9A', tipo: 'DISPONIBLE' }, { id: '9B', tipo: 'DISPONIBLE' }, { id: '9C', tipo: 'DISPONIBLE' }, { id: '9D', tipo: 'DISPONIBLE' }, { id: '9E', tipo: 'DISPONIBLE' }, { id: '9F', tipo: 'DISPONIBLE' }] },
];

export default function MisVuelos({ userInfo, setActiveItem }: { userInfo: any, setActiveItem: (item: string) => void }) {
  // Estados para la vista de tabla
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEstado, setLoadingEstado] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos los Estados");
  const [menuAbiertoId, setMenuAbiertoId] = useState<string | null>(null);

  // Estados para la vista de edición
  const [vueloEditando, setVueloEditando] = useState<any | null>(null);
  const [salidaEdit, setSalidaEdit] = useState("");
  const [llegadaEdit, setLlegadaEdit] = useState("");
  const [precioEdit, setPrecioEdit] = useState("");
  const [asientosVendidos, setAsientosVendidos] = useState<string[]>([]);
  const [asientosBloqueados, setAsientosBloqueados] = useState<string[]>([]);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  useEffect(() => {
    if (userInfo?.id_proveedor) {
      cargarVuelos();
    }
  }, [userInfo?.id_proveedor]);

  // Cargar asientos reales cuando se abre un vuelo para editar
  useEffect(() => {
    if (vueloEditando) {
      const vueloId = vueloEditando.api_id || vueloEditando.id;
      if (vueloId) {
        fetch(`https://seal-app-u4egd.ondigitalocean.app/api/reservas/verificar/${vueloId}/`)
          .then(res => res.json())
          .then(data => {
            if (data.asientos_ocupados) {
              const bloqueadosActuales = vueloEditando.asientos_ocupados ? vueloEditando.asientos_ocupados.split(',').map((a: string) => a.trim()) : [];
              const vendidosReales = data.asientos_ocupados.filter((asiento: string) => !bloqueadosActuales.includes(asiento));
              setAsientosVendidos(vendidosReales);
            }
          })
          .catch(err => console.error("Error al obtener asientos:", err));
      }
    }
  }, [vueloEditando]);

  const isPastDate = (fechaStr: string) => {
    if (!fechaStr || fechaStr === "Sin fecha") return false;
    const meses: Record<string, number> = { "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5, "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11 };
    try {
      const parts = fechaStr.toLowerCase().replace(/[.,]/g, '').split(/\s+/);
      if (parts.length >= 3) {
        const dia = parseInt(parts[0]), mes = meses[parts[1].substring(0, 3)], anio = parseInt(parts[2]);
        if (mes !== undefined && !isNaN(dia) && !isNaN(anio)) {
          const vueloDate = new Date(anio, mes, dia);
          const today = new Date(); today.setHours(0, 0, 0, 0);
          return vueloDate < today;
        }
      }
      const parsed = new Date(fechaStr);
      if (!isNaN(parsed.getTime())) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return parsed < today;
      }
    } catch (e) { return false; }
    return false;
  };

  const cargarVuelos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://seal-app-u4egd.ondigitalocean.app/api/vuelos/listar/?id_proveedor=${userInfo.id_proveedor}`);
      if (res.ok) {
        const data = await res.json();
        const vuelosActualizados = data.map((v: any) => ({
          ...v,
          disponibilidad: isPastDate(v.fecha_salida) ? "Finalizado" : v.disponibilidad,
          estado_vuelo: v.estado_vuelo || "A Tiempo"
        }));
        setVuelos(vuelosActualizados);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleEliminar = async (apiId: string) => {
    if (!confirm("¿Deseas retirar este vuelo de tu catálogo?")) return;
    try {
      const res = await fetch(`https://seal-app-u4egd.ondigitalocean.app/api/vuelos/eliminar/?vuelo_id=${apiId}&usuario_id=${userInfo.id}`, { method: 'DELETE' });
      if (res.ok) cargarVuelos();
    } catch (e) { alert("Error al conectar con el servidor."); }
  };

  const handleActualizarEstado = async (apiId: string, nuevoEstado: string) => {
    setLoadingEstado(apiId);
    try {
      const res = await fetch(`https://seal-app-u4egd.ondigitalocean.app/api/vuelos/actualizar-estado/${apiId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado_vuelo: nuevoEstado, usuario_id: userInfo.id })
      });
      if (res.ok) {
        setVuelos(prev => prev.map(v => v.api_id === apiId ? { ...v, estado_vuelo: nuevoEstado } : v));
      } else { alert("Error al actualizar estado."); }
    } catch (e) { alert("Error de conexión al actualizar el estado."); }
    finally { setLoadingEstado(null); }
  };

  // Lógica para abrir el editor
  const abrirEditor = (vuelo: any) => {
    setVueloEditando(vuelo);
    setPrecioEdit(vuelo.precio?.toString() || "");
    setAsientosBloqueados(vuelo.asientos_ocupados ? vuelo.asientos_ocupados.split(',').map((a: string) => a.trim()) : []);
    setMenuAbiertoId(null);
  };

  const toggleBloqueoAsiento = (asientoId: string) => {
    if (asientosVendidos.includes(asientoId)) {
      alert("Este asiento ya ha sido comprado y no puede modificarse.");
      return;
    }
    if (asientosBloqueados.includes(asientoId)) {
      setAsientosBloqueados(asientosBloqueados.filter(id => id !== asientoId));
    } else {
      setAsientosBloqueados([...asientosBloqueados, asientoId]);
    }
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoEdicion(true);

    const payloadEdit: any = {
      vuelo_id: vueloEditando.api_id,
      usuario_id: userInfo?.id,
      precio_base: parseFloat(precioEdit),
      asientos_ocupados: asientosBloqueados.join(',')
    };

    if (salidaEdit) payloadEdit.fecha_salida = salidaEdit.replace("T", " ") + ":00";
    if (llegadaEdit) payloadEdit.fecha_llegada = llegadaEdit.replace("T", " ") + ":00";

    try {
      const res = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/vuelos/modificar/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadEdit)
      });

      if (res.ok) {
        alert("¡Vuelo actualizado con éxito!");
        setVueloEditando(null); // Cerramos el editor
        cargarVuelos(); // Refrescamos la tabla
      } else {
        alert("Ocurrió un error al editar.");
      }
    } catch (err) { alert("No se pudo comunicar con el servidor."); }
    finally { setGuardandoEdicion(false); }
  };

  const filtrados = vuelos.filter(v => {
    const coincideTxt = (v.destino_completo || "").toLowerCase().includes(search.toLowerCase()) || (v.origen_completo || "").toLowerCase().includes(search.toLowerCase());
    const coincideEst = filtroEstado === "Todos los Estados" || v.disponibilidad === filtroEstado;
    return coincideTxt && coincideEst;
  });

  const getColorEstadoOperativo = (estado: string) => {
    switch (estado) {
      case "A Tiempo": return "bg-green-100 text-green-700 border-green-200";
      case "Retrasado": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Abordando": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelado": return "bg-red-100 text-red-700 border-red-200";
      case "Reprogramado": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // ==========================================
  // RENDERIZADO CONDICIONAL (EDICIÓN O TABLA)
  // ==========================================

  if (vueloEditando) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Editar Vuelo</h2>
            <p className="text-slate-500 font-medium mt-1">Bloquea asientos y ajusta las tarifas.</p>
          </div>
          <button onClick={() => setVueloEditando(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold bg-transparent border-none cursor-pointer">
            <ArrowLeft className="w-5 h-5" /> Cancelar Edición
          </button>
        </div>

        <form onSubmit={handleGuardarEdicion} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Ruta Establecida (No Modificable)</p>
            <p className="text-xl font-black text-slate-800">{vueloEditando.origen_completo} <span className="text-green-600 mx-2">→</span> {vueloEditando.destino_completo}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold text-sm text-slate-700">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Nueva Fecha/Hora Salida <span className="text-slate-400">(Opcional)</span></label>
              <input type="datetime-local" value={salidaEdit} onChange={(e) => setSalidaEdit(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Nueva Fecha/Hora Llegada <span className="text-slate-400">(Opcional)</span></label>
              <input type="datetime-local" value={llegadaEdit} onChange={(e) => setLlegadaEdit(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="space-y-2 w-full md:w-1/2">
              <label className="text-xs font-bold text-slate-800 text-center block uppercase tracking-wider">Precio Base ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="number" min="1" step="0.01" value={precioEdit} onChange={(e) => setPrecioEdit(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-center" required />
              </div>
            </div>
          </div>

          {/* MAPA DE ASIENTOS */}
          <div className="border-t border-slate-100 pt-8 mt-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Gestión de Asientos</h3>
                <p className="text-xs font-bold text-slate-400">Bloquea asientos para mantenimiento o personal. Los vendidos no se pueden tocar.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mb-6 bg-slate-50/50 rounded-2xl border border-slate-100 font-bold text-xs text-slate-500">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded"></div> Disponible</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div> Bloqueado por ti</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#1e293b] rounded"></div> Vendido (Cliente)</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div> Premium</div>
            </div>

            <div className="p-8 bg-slate-50/30 rounded-[2rem] border border-slate-100/80 flex flex-col items-center">
              <div className="w-full max-w-sm bg-slate-100 text-center py-2 rounded-t-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Frente del avión</div>
              <div className="space-y-3 w-full max-w-md">
                {FILAS_AVION.map((fila) => (
                  <div key={fila.numero} className="flex items-center justify-between gap-2">
                    <div className="flex gap-2 flex-1 justify-end">
                      {fila.asientos.slice(0,3).map((asiento) => {
                        const esVendido = asientosVendidos.includes(asiento.id);
                        const esBloqueado = asientosBloqueados.includes(asiento.id);

                        let claseColor = "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700";
                        if (asiento.tipo === 'PREMIUM') claseColor = "bg-green-100 hover:bg-green-200 border border-green-300 text-green-700";
                        if (esBloqueado) claseColor = "bg-red-100 text-red-600 border-red-300 hover:bg-red-200 shadow-inner";
                        if (esVendido) claseColor = "bg-[#1e293b] text-white cursor-not-allowed opacity-80";

                        return (
                          <button key={asiento.id} type="button" onClick={() => toggleBloqueoAsiento(asiento.id)} className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${claseColor}`}>
                            {asiento.id}
                          </button>
                        );
                      })}
                    </div>
                    <div className="w-8 text-center text-xs font-black text-slate-300">{fila.numero}</div>
                    <div className="flex gap-2 flex-1 justify-start">
                      {fila.asientos.slice(3,6).map((asiento) => {
                        const esVendido = asientosVendidos.includes(asiento.id);
                        const esBloqueado = asientosBloqueados.includes(asiento.id);

                        let claseColor = "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700";
                        if (asiento.tipo === 'PREMIUM') claseColor = "bg-green-100 hover:bg-green-200 border border-green-300 text-green-700";
                        if (esBloqueado) claseColor = "bg-red-100 text-red-600 border-red-300 hover:bg-red-200 shadow-inner";
                        if (esVendido) claseColor = "bg-[#1e293b] text-white cursor-not-allowed opacity-80";

                        return (
                          <button key={asiento.id} type="button" onClick={() => toggleBloqueoAsiento(asiento.id)} className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${claseColor}`}>
                            {asiento.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={guardandoEdicion} className="w-full bg-[#4d7c44] hover:bg-green-700 text-white py-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 cursor-pointer border-none mt-4">
            {guardandoEdicion ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Modificaciones"}
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // RENDERIZADO DE LA TABLA NORMAL
  // ==========================================
  return (
    <div className="space-y-8" onClick={() => setMenuAbiertoId(null)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mis Vuelos</h2>
          <p className="text-slate-500 font-medium mt-1">Gestiona las rutas, disponibilidad y estado operativo.</p>
        </div>
        <button
          onClick={() => setActiveItem('Agregar Vuelo')}
          className="bg-[#4d7c44] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border-none"
        >
          <PlusCircle className="w-5 h-5" /> Agregar Nuevo Vuelo
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Buscar vuelos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-50 pl-12 pr-4 py-3 rounded-xl border border-slate-200 font-semibold outline-none" />
        </div>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold outline-none cursor-pointer">
          <option value="Todos los Estados">Todos los Estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Limitado">Limitado</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#4d7c44]" /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4">Origen / Destino</th>
                <th className="p-4">Fecha Salida</th>
                <th className="p-4 text-center">Boletos</th>
                <th className="p-4 text-center">Estado Operativo</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-semibold">
              {filtrados.map((v) => {
                let badgeColor = "bg-green-100 text-green-700";
                if (v.disponibilidad === "Limitado") badgeColor = "bg-orange-100 text-orange-700";
                if (v.disponibilidad === "Finalizado") badgeColor = "bg-slate-100 text-slate-500 border border-slate-200";

                const isVueloFinalizado = v.disponibilidad === "Finalizado";

                return (
                  <tr key={v.api_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{v.destino_completo}</span>
                        <span className="text-xs font-bold text-slate-400">Desde {v.origen_completo}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">
                      {v.fecha_salida} <br/>
                      <span className="text-xs text-slate-400">${v.precio?.toLocaleString()} MXN</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${badgeColor}`}>
                        {v.disponibilidad}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {loadingEstado === v.api_id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
                      ) : (
                        <select
                          value={v.estado_vuelo || "A Tiempo"}
                          onChange={(e) => handleActualizarEstado(v.api_id, e.target.value)}
                          disabled={isVueloFinalizado}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border outline-none cursor-pointer text-center appearance-none ${getColorEstadoOperativo(v.estado_vuelo || "A Tiempo")} ${isVueloFinalizado ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="A Tiempo">A Tiempo</option>
                          <option value="Abordando">Abordando</option>
                          <option value="Retrasado">Retrasado</option>
                          <option value="Reprogramado">Reprogramado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setMenuAbiertoId(menuAbiertoId === v.api_id ? null : v.api_id)} className="p-2 text-slate-400 hover:text-slate-900 bg-transparent border-none cursor-pointer"><MoreHorizontal className="w-5 h-5" /></button>
                      {menuAbiertoId === v.api_id && (
                        <div className="absolute right-8 top-10 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-36 z-50">
                          <button
                            onClick={() => abrirEditor(v)}
                            className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 bg-transparent border-none cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" /> Editar
                          </button>
                          <button onClick={() => handleEliminar(v.api_id)} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 bg-transparent border-none cursor-pointer"><Trash2 className="w-4 h-4" /> Eliminar</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-bold">No se encontraron vuelos con esos criterios.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}