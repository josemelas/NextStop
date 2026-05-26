"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Activity,
  LogOut,
  Loader2,
  Plane,
  RefreshCw
} from 'lucide-react';

export default function MonitoreoVuelosPage() {
  const pathname = usePathname();
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
      case "A Tiempo": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Retrasado": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Abordando": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Cancelado": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Reprogramado": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex font-sans text-slate-200">

      {/* SIDEBAR EXCLUSIVO DE ADMINISTRACIÓN */}
      <aside className="w-72 bg-[#1e293b] text-white flex flex-col shadow-2xl sticky top-0 h-screen z-10">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">Next<span className="text-orange-500">Stop</span></h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Panel de Control General</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/admin/dashboard"
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
              pathname === '/admin/dashboard'
              ? 'bg-slate-800 text-white shadow-inner'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${pathname === '/admin/dashboard' ? 'text-orange-500' : ''}`} />
            Estadísticas y KPIs
          </Link>

          <Link
            href="/admin/usuarios"
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
              pathname === '/admin/usuarios'
              ? 'bg-slate-800 text-white shadow-inner'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className={`w-5 h-5 ${pathname === '/admin/usuarios' ? 'text-orange-500' : ''}`} />
            Gestión de Usuarios
          </Link>

          <Link
            href="/admin/monitoreo"
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
              pathname === '/admin/monitoreo'
              ? 'bg-slate-800 text-white shadow-inner'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className={`w-5 h-5 ${pathname === '/admin/monitoreo' ? 'text-orange-500' : ''}`} />
            Monitoreo de Vuelos
          </Link>

          <div className="pt-6 mt-6 border-t border-slate-800 px-2">
            <Link
              href="/cliente/menupr"
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800 text-slate-300 font-black italic hover:bg-slate-700 transition-all text-center justify-center text-xs tracking-wider border border-slate-700"
            >
              VOLVER AL PORTAL CLIENTE
            </Link>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800">
          <Link
            href="/"
            onClick={() => localStorage.clear()}
            className="w-full flex items-center gap-4 text-slate-500 hover:text-red-400 p-4 rounded-2xl font-bold transition-all"
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión Admin
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight italic uppercase flex items-center gap-3">
                <Activity className="w-8 h-8 text-orange-500" />
                Radar Global de Vuelos
              </h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Supervisión en tiempo real de todos los vuelos programados por las agencias.</p>
            </div>
            <button
              onClick={cargarVuelos}
              className="bg-[#1e293b] hover:bg-slate-800 text-slate-300 p-4 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs border border-slate-800"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
              ACTUALIZAR RADAR
            </button>
          </div>

          <div className="bg-[#1e293b] rounded-[3rem] border border-slate-800 shadow-sm p-8 relative overflow-hidden">
            {/* Línea decorativa superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-orange-500" />
                <p className="font-black text-xs uppercase tracking-widest">Sincronizando con satélites...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="pb-4 pl-4">Vuelo / Aerolínea</th>
                      <th className="pb-4">Ruta (Origen → Destino)</th>
                      <th className="pb-4">Fecha Programada</th>
                      <th className="pb-4 text-right pr-4">Estado Operativo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm font-semibold text-slate-300">
                    {vuelos.map((v) => (
                      <tr key={v.id_vuelo} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#0f172a] border border-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
                              <Plane className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white">{v.aerolinea}</span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID: {v.id_vuelo.split('-')[0]}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <span className="truncate max-w-[150px]">{v.origen_completo}</span>
                            <span className="text-orange-500 text-lg">→</span>
                            <span className="truncate max-w-[150px] text-white">{v.destino_completo}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-400">
                          {v.fecha_salida}
                        </td>
                        <td className="py-4 text-right pr-4">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getColorEstadoOperativo(v.estado_vuelo)}`}>
                            {v.estado_vuelo}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {vuelos.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-slate-400 font-bold uppercase text-xs">
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