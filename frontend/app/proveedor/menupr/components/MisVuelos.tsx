"use client";

import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, MoreHorizontal, Edit2, Trash2, Loader2, PlaneTakeoff } from 'lucide-react';

export default function MisVuelos({ userInfo, setActiveItem }: { userInfo: any, setActiveItem: (item: string) => void }) {
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos los Estados");
  const [menuAbiertoId, setMenuAbiertoId] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo?.id_proveedor) {
      cargarVuelos();
    }
  }, [userInfo?.id_proveedor]);

  const isPastDate = (fechaStr: string) => {
    if (!fechaStr || fechaStr === "Sin fecha") return false;

    const meses: Record<string, number> = {
      "ene": 0, "feb": 1, "mar": 2, "abr": 3, "may": 4, "jun": 5,
      "jul": 6, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dic": 11
    };

    try {
      const parts = fechaStr.toLowerCase().replace(/[.,]/g, '').split(/\s+/);
      if (parts.length >= 3) {
        const dia = parseInt(parts[0]);
        const mesStr = parts[1].substring(0, 3);
        const mes = meses[mesStr];
        const anio = parseInt(parts[2]);

        if (mes !== undefined && !isNaN(dia) && !isNaN(anio)) {
          const vueloDate = new Date(anio, mes, dia);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return vueloDate < today;
        }
      }

      const parsed = new Date(fechaStr);
      if (!isNaN(parsed.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parsed < today;
      }
    } catch (e) {
      return false;
    }
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
          disponibilidad: isPastDate(v.fecha_salida) ? "Finalizado" : v.disponibilidad
        }));
        setVuelos(vuelosActualizados);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (apiId: string) => {
    if (!confirm("¿Deseas retirar este vuelo de tu catálogo?")) return;
    try {
      const res = await fetch(`https://seal-app-u4egd.ondigitalocean.app/api/vuelos/eliminar/?vuelo_id=${apiId}&usuario_id=${userInfo.id}`, {
        method: 'DELETE'
      });
      if (res.ok) cargarVuelos();
    } catch (e) {
      alert("Error al conectar con el servidor.");
    }
  };

  const filtrados = vuelos.filter(v => {
    const coincideTxt = (v.destino_completo || "").toLowerCase().includes(search.toLowerCase()) || (v.origen_completo || "").toLowerCase().includes(search.toLowerCase());
    const coincideEst = filtroEstado === "Todos los Estados" || v.disponibilidad === filtroEstado;
    return coincideTxt && coincideEst;
  });

  return (
    <div className="space-y-8" onClick={() => setMenuAbiertoId(null)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mis Vuelos</h2>
          <p className="text-slate-500 font-medium mt-1">Gestiona las rutas y disponibilidad de tu catálogo.</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('vuelo_editar'); // Limpiamos para asegurar que sea "Crear"
            setActiveItem('Agregar Vuelo');
          }}
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
          <option value="Agotado">Agotado</option>
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
                <th className="p-4">Precio Base</th>
                <th className="p-4">Fecha Salida</th>
                <th className="p-4 text-center">Disponibilidad</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-semibold">
              {filtrados.map((v) => {
                let badgeColor = "bg-green-100 text-green-700";
                if (v.disponibilidad === "Limitado") badgeColor = "bg-orange-100 text-orange-700";
                if (v.disponibilidad === "Agotado") badgeColor = "bg-red-100 text-red-700";
                if (v.disponibilidad === "Finalizado") badgeColor = "bg-slate-100 text-slate-500 border border-slate-200";

                return (
                  <tr key={v.api_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{v.destino_completo}</span>
                        <span className="text-xs font-bold text-slate-400">Desde {v.origen_completo}</span>
                      </div>
                    </td>
                    <td className="p-4 font-black">${v.precio.toLocaleString()}</td>
                    <td className="p-4 text-slate-500">{v.fecha_salida}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${badgeColor}`}>
                        {v.disponibilidad}
                      </span>
                    </td>
                    <td className="p-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setMenuAbiertoId(menuAbiertoId === v.api_id ? null : v.api_id)} className="p-2 text-slate-400 hover:text-slate-900 bg-transparent border-none cursor-pointer"><MoreHorizontal className="w-5 h-5" /></button>
                      {menuAbiertoId === v.api_id && (
                        <div className="absolute right-8 top-10 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-36 z-50">

                          {/* BOTÓN EDITAR */}
                          <button
                            onClick={() => {
                              localStorage.setItem('vuelo_editar', JSON.stringify(v));
                              setActiveItem('Agregar Vuelo');
                            }}
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