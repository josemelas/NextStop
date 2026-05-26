"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Plane, Activity, RefreshCw } from 'lucide-react';

export default function MonitoreoVuelosPage() {
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarVuelos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://seal-app-u4egd.ondigitalocean.app/api/vuelos/listar-admin/`);
      if (res.ok) {
        const data = await res.json();
        setVuelos(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVuelos();
    // Actualiza el tablero automáticamente cada 60 segundos
    const interval = setInterval(cargarVuelos, 60000);
    return () => clearInterval(interval);
  }, []);

  const getColorEstadoOperativo = (estado: string) => {
    switch (estado) {
      case "A Tiempo": return "bg-green-500 text-white shadow-green-200";
      case "Retrasado": return "bg-amber-500 text-white shadow-amber-200";
      case "Abordando": return "bg-blue-500 text-white shadow-blue-200";
      case "Cancelado": return "bg-red-500 text-white shadow-red-200";
      case "Reprogramado": return "bg-purple-500 text-white shadow-purple-200";
      default: return "bg-slate-500 text-white shadow-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">

      {/* <SidebarAdmin /> */}

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">

        {/* <HeaderAdmin /> */}

        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                Radar Global de Vuelos
              </h2>
              <p className="text-slate-500 font-medium mt-1">Supervisión en tiempo real de todos los vuelos programados por las agencias.</p>
            </div>
            <button
              onClick={cargarVuelos}
              className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar Radar
            </button>
          </div>

          {/* TABLERO ESTILO AEROPUERTO */}
          <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden p-6 border-4 border-slate-800 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-500" />
                <p className="font-bold tracking-widest uppercase text-sm">Sincronizando con satélites...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <th className="p-4 pl-6">Vuelo / Aerolínea</th>
                      <th className="p-4">Ruta (Origen → Destino)</th>
                      <th className="p-4">Fecha Programada</th>
                      <th className="p-4 text-right pr-6">Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {vuelos.map((v) => (
                      <tr key={v.id_vuelo} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                              <Plane className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-white">{v.aerolinea}</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {v.id_vuelo.split('-')[0]}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3 font-semibold text-slate-300">
                            <span className="truncate max-w-[150px]">{v.origen_completo}</span>
                            <span className="text-orange-500 text-lg">→</span>
                            <span className="truncate max-w-[150px] text-white">{v.destino_completo}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 font-bold tracking-wide">
                          {v.fecha_salida}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-md ${getColorEstadoOperativo(v.estado_vuelo)}`}>
                            {v.estado_vuelo}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {vuelos.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-slate-500 font-bold text-lg">
                          No hay vuelos registrados en el radar en este momento.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}