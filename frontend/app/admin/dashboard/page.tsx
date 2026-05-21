"use client";

import React, { useState, useEffect } from 'react';
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
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminService } from '@/lib/adminService';

export default function AdminDashboard() {
  const pathname = usePathname();

  // Estados para albergar la data del backend de Brian
  const [kpis, setKpis] = useState({
    vuelos_totales: 0,
    agencias_activas: 0,
    ventas_mes: 0,
    ingresos_mes: 0
  });
  const [directorioAgencias, setDirectorioAgencias] = useState<any[]>([]);
  const [estadoAmadeus, setEstadoAmadeus] = useState("OFFLINE");

  // Estados de control de la UI
  const [isLoading, setIsLoading] = useState(true);
  const [errorApi, setErrorApi] = useState("");

  // Carga e integración en caliente conectando con Django
  useEffect(() => {
    const cargarDatosDashboard = async () => {
      if (typeof window !== "undefined") {
        const tokenJWT = localStorage.getItem("user_token") || "";

        if (!tokenJWT) {
          setErrorApi("No se detectó una sesión activa de administrador. Por favor reingresa.");
          setIsLoading(false);
          return;
        }

        // Consumimos el método unificado que ya tiene el dominio oficial /api
        const res = await adminService.obtenerEstadisticas(tokenJWT);

        if (res.status === 200) {
          setKpis(res.data.kpis);
          setDirectorioAgencias(res.data.directorio_agencias || []);
          setEstadoAmadeus(res.data.estado_amadeus || "ONLINE");
        } else {
          setErrorApi(res.data.detail || "Error al sincronizar datos reales con DigitalOcean.");
        }
        setIsLoading(false);
      }
    };

    cargarDatosDashboard();
  }, []);

  // Formateador estándar de moneda
  const formatoMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">

      {/* SIDEBAR EXCLUSIVO DE ADMINISTRACIÓN */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col shadow-2xl sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">Next<span className="text-orange-500">Stop</span></h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Panel de Control General</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/admin/dashboard"
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
              pathname === '/admin/dashboard'
              ? 'bg-white/10 text-white border border-white/5 shadow-inner'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${pathname === '/admin/dashboard' ? 'text-orange-500' : ''}`} />
            Estadísticas y KPIs
          </Link>

          <Link
            href="/admin/usuarios"
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
              pathname === '/admin/usuarios'
              ? 'bg-white/10 text-white border border-white/5 shadow-inner'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            Gestión de Usuarios
          </Link>

          <div className="pt-6 mt-6 border-t border-white/10 px-2">
            <Link
              href="/cliente/menupr"
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800 text-slate-300 font-black italic hover:bg-slate-700 transition-all text-center justify-center text-xs tracking-wider"
            >
              VOLVER AL PORTAL CLIENTE
            </Link>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <Link
            href="/"
            onClick={() => localStorage.clear()}
            className="w-full flex items-center gap-4 text-slate-500 hover:text-red-400 p-4 rounded-2xl font-bold transition-all"
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión Admin
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DEL DASHBOARD */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ENCABEZADO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Estadísticas y KPIs</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Monitoreo operacional y financiero global en tiempo real</p>
            </div>

            {/* ESTADO CONECTOR AMADEUS DINÁMICO */}
            <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-slate-100 shadow-sm self-start">
              <Globe className={`w-5 h-5 ${estadoAmadeus === 'ONLINE' ? 'text-emerald-500 animate-spin-[spin_3s_linear_infinite]' : 'text-red-500'}`} />
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                API GDS Amadeus: {' '}
                <span className={`font-black ${estadoAmadeus === 'ONLINE' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {estadoAmadeus}
                </span>
              </div>
            </div>
          </div>

          {/* MANEJO DE ALERTAS POR ERRORES DE AUTENTICACIÓN / API */}
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
              {/* CUADRÍCULA DE 4 TARJETAS KPIS REALES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* KPI 1: INGRESOS MES */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos del Mes</p>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">{formatoMoneda(kpis.ingresos_mes)}</h3>
                  </div>
                </div>

                {/* KPI 2: VENTAS MES */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reservas del Mes</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{kpis.ventas_mes}</h3>
                  </div>
                </div>

                {/* KPI 3: VUELOS TOTALES */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <Plane className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vuelos en Oferta</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{kpis.vuelos_totales}</h3>
                  </div>
                </div>

                {/* KPI 4: AGENCIAS ACTIVAS */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agencias Activas</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{kpis.agencias_activas}</h3>
                  </div>
                </div>

              </div>

              {/* TABLA: DIRECTORIO DE PROVEEDORES Y AGENCIAS (ORDENADO TOP INGRESOS) */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <div className="mb-6">
                  <h4 className="font-black text-lg text-slate-900 uppercase tracking-tight">Rendimiento e Ingresos por Proveedor API</h4>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">Top 5 agencias externas ordenadas de mayor a menor recaudación de transacciones pagadas</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="pb-4 pl-4">Agencia / Proveedor</th>
                        <th className="pb-4">Estado Sistema</th>
                        <th className="pb-4 text-center">Vuelos Conectados</th>
                        <th className="pb-4 text-right pr-4">Total Recaudado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                      {directorioAgencias.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 font-bold uppercase text-xs">
                            No hay agencias ni ventas registradas en este periodo
                          </td>
                        </tr>
                      ) : (
                        directorioAgencias.map((agencia, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 pl-4 font-bold text-slate-900">{agencia.nombre}</td>
                            <td className="py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                $.trim(agencia.estado) === 'Activo'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                {agencia.estado}
                              </span>
                            </td>
                            <td className="py-4 text-center font-bold text-slate-600">{agencia.vuelos}</td>
                            <td className="py-4 text-right pr-4 font-black text-emerald-600">{formatoMoneda(agencia.ingresos)}</td>
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