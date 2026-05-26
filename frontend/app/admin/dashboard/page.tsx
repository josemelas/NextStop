"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  Plane,
  DollarSign,
  TrendingUp,
  Globe,
  Building2,
  Loader2,
  AlertCircle,
  LogOut,
  Filter,
  Activity // <-- Nuevo ícono importado
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminService } from '@/lib/adminService';

export default function AdminDashboard() {
  const pathname = usePathname();

  // Obtenemos mes y año actuales para los valores por defecto
  const fechaActual = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState((fechaActual.getMonth() + 1).toString());
  const [anioSeleccionado, setAnioSeleccionado] = useState(fechaActual.getFullYear().toString());

  const [kpis, setKpis] = useState({
    vuelos_totales: 0,
    agencias_activas: 0,
    ventas_mes: 0,
    ingresos_mes: 0
  });
  const [directorioAgencias, setDirectorioAgencias] = useState<any[]>([]);
  const [estadoAmadeus, setEstadoAmadeus] = useState("OFFLINE");

  const [isLoading, setIsLoading] = useState(true);
  const [errorApi, setErrorApi] = useState("");

  const meses = [
    { valor: '1', nombre: 'Enero' }, { valor: '2', nombre: 'Febrero' },
    { valor: '3', nombre: 'Marzo' }, { valor: '4', nombre: 'Abril' },
    { valor: '5', nombre: 'Mayo' }, { valor: '6', nombre: 'Junio' },
    { valor: '7', nombre: 'Julio' }, { valor: '8', nombre: 'Agosto' },
    { valor: '9', nombre: 'Septiembre' }, { valor: '10', nombre: 'Octubre' },
    { valor: '11', nombre: 'Noviembre' }, { valor: '12', nombre: 'Diciembre' }
  ];

  // Años dinámicos basados en el actual y anteriores
  const anios = [
    fechaActual.getFullYear().toString(),
    (fechaActual.getFullYear() - 1).toString(),
    (fechaActual.getFullYear() - 2).toString(),
  ];

  // Función envuelta en useCallback para poder llamarla cuando cambien los filtros
  const cargarDatosDashboard = useCallback(async () => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      const tokenJWT = localStorage.getItem("user_token") || "";

      if (!tokenJWT) {
        setErrorApi("No se detectó una sesión activa de administrador. Por favor reingresa.");
        setIsLoading(false);
        return;
      }

      // Pasamos los filtros al servicio (si el valor es vacío, mandamos undefined)
      const mesParam = mesSeleccionado || undefined;
      const anioParam = anioSeleccionado || undefined;

      const res = await adminService.obtenerEstadisticas(tokenJWT, mesParam, anioParam);

      if (res.status === 200) {
        setKpis(res.data.kpis);
        setDirectorioAgencias(res.data.directorio_agencias || []);
        setEstadoAmadeus(res.data.estado_amadeus || "ONLINE");
      } else {
        setErrorApi(res.data.detail || "Error al sincronizar datos reales con DigitalOcean.");
      }
      setIsLoading(false);
    }
  }, [mesSeleccionado, anioSeleccionado]);

  // Se ejecuta al montar el componente y cada vez que cambia el mes o el año
  useEffect(() => {
    cargarDatosDashboard();
  }, [cargarDatosDashboard]);

  const formatoMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex font-sans text-slate-200">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1e293b] text-white flex flex-col shadow-2xl sticky top-0 h-screen">
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

          {/* NUEVO BOTÓN: MONITOREO DE VUELOS */}
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

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight italic uppercase">Estadísticas y KPIs</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Monitoreo operacional y financiero global en tiempo real</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* FILTROS DE FECHA */}
              <div className="flex items-center gap-2 bg-[#1e293b] p-2 rounded-full border border-slate-800 shadow-sm">
                <div className="pl-3 text-slate-400">
                  <Filter className="w-4 h-4" />
                </div>
                <select
                  value={mesSeleccionado}
                  onChange={(e) => setMesSeleccionado(e.target.value)}
                  className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer pl-1 pr-2 py-1 appearance-none hover:text-orange-400 transition-colors"
                >
                  <option value="" className="bg-slate-800">Todo el año</option>
                  {meses.map(m => (
                    <option key={m.valor} value={m.valor} className="bg-slate-800">{m.nombre}</option>
                  ))}
                </select>
                <div className="w-px h-4 bg-slate-700"></div>
                <select
                  value={anioSeleccionado}
                  onChange={(e) => setAnioSeleccionado(e.target.value)}
                  className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer pl-2 pr-4 py-1 appearance-none hover:text-orange-400 transition-colors"
                >
                  {anios.map(a => (
                    <option key={a} value={a} className="bg-slate-800">{a}</option>
                  ))}
                </select>
              </div>

              {/* INDICADOR AMADEUS */}
              <div className="inline-flex items-center gap-3 bg-[#1e293b] px-5 py-3 rounded-full border border-slate-800 shadow-sm">
                <Globe className={`w-5 h-5 ${estadoAmadeus === 'ONLINE' ? 'text-emerald-500 animate-spin-[spin_3s_linear_infinite]' : 'text-red-500'}`} />
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  API GDS Amadeus: {' '}
                  <span className={`font-black ${estadoAmadeus === 'ONLINE' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {estadoAmadeus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {errorApi && (
            <div className="bg-red-50 border border-red-200 text-red-800 font-bold text-sm p-5 rounded-3xl flex items-center gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p>{errorApi}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Sincronizando con DigitalOcean...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-[2.5rem] border border-slate-800 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-950/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-900">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos del Periodo</p>
                    <h3 className="text-xl font-black text-white tracking-tight mt-0.5">{formatoMoneda(kpis.ingresos_mes)}</h3>
                  </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-[2.5rem] border border-slate-800 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-orange-950/20 rounded-2xl flex items-center justify-center text-orange-400 border border-orange-900">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reservas del Periodo</p>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">{kpis.ventas_mes}</h3>
                  </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-[2.5rem] border border-slate-800 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-950/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-900">
                    <Plane className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vuelos en Oferta</p>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">{kpis.vuelos_totales}</h3>
                  </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-[2.5rem] border border-slate-800 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-purple-950/20 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-900">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agencias Activas</p>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">{kpis.agencias_activas}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-[3rem] border border-slate-800 shadow-sm p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-lg text-white uppercase tracking-tight">Rendimiento e Ingresos por Proveedor API</h4>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">Top 5 agencias externas ordenadas de mayor a menor recaudación de transacciones pagadas</p>
                  </div>
                  <Link href="/admin/usuarios" className="text-xs font-black uppercase text-orange-500 hover:text-orange-400 transition-colors">VER TODAS</Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="pb-4 pl-4">Agencia / Proveedor</th>
                        <th className="pb-4">Estado Sistema</th>
                        <th className="pb-4 text-center">Vuelos Conectados</th>
                        <th className="pb-4 text-right pr-4">Total Recaudado</th>
                        <th className="pb-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm font-semibold text-slate-300">
                      {directorioAgencias.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 font-bold uppercase text-xs">
                            No hay agencias ni ventas registradas en este periodo
                          </td>
                        </tr>
                      ) : (
                        directorioAgencias.map((agencia, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 pl-4 font-bold text-white">{agencia.nombre}</td>
                            <td className="py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                agencia.estado?.trim() === 'Activo'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-900'
                                : 'bg-amber-950 text-amber-300 border-amber-900'
                              }`}>
                                {agencia.estado}
                              </span>
                            </td>
                            <td className="py-4 text-center font-bold text-slate-400">{agencia.vuelos}</td>
                            <td className="py-4 text-right pr-4 font-black text-emerald-400">{formatoMoneda(agencia.ingresos)}</td>
                            <td className="py-4 text-slate-600 text-lg">›</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}