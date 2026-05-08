"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminGuard';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import {
  Users, Plane, DollarSign, Activity,
  ChevronRight, ArrowUpRight, ShieldCheck, Globe
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/cliente/menupr');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] flex font-sans text-slate-200">
      <SidebarCliente />

      <main className="flex-1 p-8 overflow-y-auto">
        <HeaderUsuario />

        <div className="max-w-7xl mx-auto">
          {/* HEADER SECCIÓN */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                Panel de <span className="text-orange-500">Administración</span>
              </h1>
              <p className="text-slate-400 font-medium">Gestión global de NextStop Ecosystem</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">API Amadeus: Online</span>
              </div>
            </div>
          </div>

          {/* METRICAS PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <MetricCard title="Vuelos Totales" value="156" icon={<Plane />} trend="+12%" color="text-blue-400" />
            <MetricCard title="Agencias" value="24" icon={<Globe />} trend="Estable" color="text-orange-400" />
            <MetricCard title="Ventas Mes" value="2,840" icon={<Activity />} trend="+24%" color="text-green-400" />
            <MetricCard title="Ingresos" value="$892k" icon={<DollarSign />} trend="+18%" color="text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TABLA DE PROVEEDORES */}
            <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Directorio de Agencias</h3>
                <button className="text-xs font-black text-orange-500 uppercase hover:underline">Ver todas</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                      <th className="px-4">Agencia</th>
                      <th>Estado</th>
                      <th>Vuelos</th>
                      <th>Ingresos</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AgencyRow name="SkyWings Travel" status="Activo" count="45" money="$128k" color="bg-green-500" />
                    <AgencyRow name="AirJet Agency" status="Activo" count="32" money="$98k" color="bg-green-500" />
                    <AgencyRow name="Oceanic Voyages" status="Pendiente" count="12" money="$34k" color="bg-yellow-500" />
                    <AgencyRow name="GlobalAir Tours" status="Activo" count="28" money="$85k" color="bg-green-500" />
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACCIONES RÁPIDAS */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-500/10">
                <ShieldCheck className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-black italic uppercase leading-none mb-2">Seguridad Crítica</h3>
                <p className="text-sm opacity-80 font-medium mb-6">Manejo de tokens, encriptación de BD y auditoría de accesos.</p>
                <button className="w-full bg-black/20 hover:bg-black/30 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Configurar API
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                <h3 className="text-lg font-black italic text-white uppercase mb-6">Próximos Despliegues</h3>
                <div className="space-y-4">
                  <StatusItem label="Módulo de Hoteles" progress={85} />
                  <StatusItem label="Pasarela de Pagos" progress={40} />
                  <StatusItem label="App Mobile (iOS)" progress={15} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// COMPONENTES AUXILIARES ESTILIZADOS
function MetricCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-slate-800 ${color} group-hover:scale-110 transition-transform`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
    </div>
  );
}

function AgencyRow({ name, status, count, money, color }: any) {
  return (
    <tr className="bg-slate-800/30 hover:bg-slate-800/50 transition-colors group">
      <td className="px-4 py-4 rounded-l-2xl">
        <p className="font-bold text-slate-200">{name}</p>
        <p className="text-[10px] text-slate-500 font-bold uppercase">Proveedor Verificado</p>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
          <span className="text-xs font-bold text-slate-300">{status}</span>
        </div>
      </td>
      <td className="font-black text-slate-400">{count}</td>
      <td className="font-black text-white">{money}</td>
      <td className="px-4 rounded-r-2xl text-right">
        <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </td>
    </tr>
  );
}

function StatusItem({ label, progress }: any) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase mb-2">
        <span className="text-slate-400">{label}</span>
        <span className="text-orange-500">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}