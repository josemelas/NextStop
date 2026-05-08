"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminGuard';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { Users, PlaneTakeoff, Settings, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/cliente/menupr'); // Expulsar si no es admin
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SidebarCliente />
      <main className="flex-1 p-12">
        <HeaderUsuario />

        <div className="max-w-6xl mx-auto mt-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-5xl font-black text-slate-900 italic uppercase">Panel de Control</h1>
              <p className="text-slate-500 font-bold">Bienvenido, Administrador de NextStop</p>
            </div>
            <div className="bg-orange-500 text-white px-6 py-2 rounded-full font-black text-xs">MODO DIOS ACTIVO</div>
          </div>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <AdminCard icon={<Users />} title="Usuarios Totales" value="1,240" color="bg-blue-500" />
            <AdminCard icon={<PlaneTakeoff />} title="Vuelos Reservados" value="85" color="bg-orange-500" />
            <AdminCard icon={<BarChart3 />} title="Ingresos Mes" value="$45,200" color="bg-green-500" />
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-200">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Settings className="text-orange-500" /> Configuraciones Críticas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-orange-500 transition-all text-left group">
                <p className="font-black text-slate-900 group-hover:text-orange-500">Gestionar API Amadeus</p>
                <p className="text-xs text-slate-400">Verificar estado de tokens y cuotas</p>
              </button>
              <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-orange-500 transition-all text-left group">
                <p className="font-black text-slate-900 group-hover:text-orange-500">Base de Datos Usuarios</p>
                <p className="text-xs text-slate-400">Editar permisos y bloqueos</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-lg transition-all">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}