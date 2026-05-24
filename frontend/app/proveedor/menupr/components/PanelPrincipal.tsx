"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, DollarSign, Eye, MapPin, TrendingUp, Loader2 } from 'lucide-react';

export default function PanelPrincipal({ userInfo, setActiveItem }: { userInfo: any, setActiveItem: (item: string) => void }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mesFiltro, setMesFiltro] = useState('Todos');
  const [anioFiltro, setAnioFiltro] = useState('Todos');

  useEffect(() => {
    if (userInfo?.id_proveedor) {
      let url = `https://seal-app-u4egd.ondigitalocean.app/api/usuarios/proveedor/dashboard/?id_proveedor=${userInfo.id_proveedor}`;
      if (mesFiltro !== 'Todos') url += `&mes=${mesFiltro}`;
      if (anioFiltro !== 'Todos') url += `&anio=${anioFiltro}`;

      setLoading(true);
      fetch(url)
        .then(res => res.json())
        .then(data => setDashboardData(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [userInfo?.id_proveedor, mesFiltro, anioFiltro]);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>;
  if (!dashboardData) return <div className="text-center text-slate-500 mt-20">No se pudo conectar al servidor.</div>;

  const { kpis, vuelos_recientes, destinos_principales } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Cabecera interna */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight italic">Bienvenido, {userInfo?.nombres || 'Socio'}</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">{dashboardData?.agencia?.nombre || 'Agencia Proveedora'}</p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3">
          <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm outline-none cursor-pointer">
            <option value="Todos">Mes (Todos)</option>
            <option value="1">Enero</option><option value="2">Febrero</option><option value="3">Marzo</option>
            <option value="4">Abril</option><option value="5">Mayo</option><option value="6">Junio</option>
            <option value="7">Julio</option><option value="8">Agosto</option><option value="9">Septiembre</option>
            <option value="10">Octubre</option><option value="11">Noviembre</option><option value="12">Diciembre</option>
          </select>
          <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm outline-none cursor-pointer">
            <option value="Todos">Año (Todos)</option>
            <option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option>
          </select>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-50 p-3 rounded-2xl"><Plane className="w-6 h-6 text-green-600" /></div>
            <span className="flex items-center text-xs font-bold text-green-600"><TrendingUp className="w-3 h-3 mr-1"/> +3</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{kpis?.vuelos_activos ?? 0}</h3>
            <p className="text-sm font-bold text-slate-400 mt-1">Vuelos Activos</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-3 rounded-2xl"><Calendar className="w-6 h-6 text-slate-600" /></div>
            <span className="flex items-center text-xs font-bold text-green-600"><TrendingUp className="w-3 h-3 mr-1"/> +12%</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{kpis?.total_reservas ?? 0}</h3>
            <p className="text-sm font-bold text-slate-400 mt-1">Total Reservas</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-3 rounded-2xl"><DollarSign className="w-6 h-6 text-slate-600" /></div>
            <span className="flex items-center text-xs font-bold text-green-600"><TrendingUp className="w-3 h-3 mr-1"/> +8%</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">${(kpis?.ingresos ?? 0).toLocaleString()}</h3>
            <p className="text-sm font-bold text-slate-400 mt-1">Ingresos</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-3 rounded-2xl"><Eye className="w-6 h-6 text-slate-600" /></div>
            <span className="flex items-center text-xs font-bold text-green-600"><TrendingUp className="w-3 h-3 mr-1"/> +18%</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{((kpis?.visitas ?? 0) / 1000).toFixed(1)}K</h3>
            <p className="text-sm font-bold text-slate-400 mt-1">Visitas al Perfil</p>
          </div>
        </div>
      </div>

      {/* Tablas de Información Breve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-900">Vuelos Recientes</h3>
            <button onClick={() => setActiveItem('Mis Vuelos')} className="text-sm font-bold text-green-600 hover:text-green-700 cursor-pointer bg-transparent border-none">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="pb-4">Destino</th>
                  <th className="pb-4">Precio</th>
                  <th className="pb-4">Fecha</th>
                  <th className="pb-4 text-right pr-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                {vuelos_recientes?.map((vuelo: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><MapPin className="w-4 h-4"/></div>
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold">{vuelo.destino}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">{vuelo.aerolinea}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-black">${vuelo.precio}</td>
                    <td className="py-4 text-slate-500 font-bold">{vuelo.fecha}</td>
                    <td className="py-4 text-right pr-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${vuelo.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {vuelo.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <h3 className="text-lg font-black text-slate-900 mb-6">Destinos Principales</h3>
          <div className="space-y-6">
            {destinos_principales?.map((destino: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 flex-shrink-0">{idx + 1}</div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 leading-tight">{destino.nombre}</span>
                  <span className="text-xs font-bold text-slate-400">{destino.reservas} reservas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}