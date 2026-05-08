"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminGuard';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { Users, Shield, User, UserCheck, Search, Filter, MoreVertical } from 'lucide-react';

export default function GestionRoles() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                Control de <span className="text-orange-500">Usuarios y Roles</span>
              </h1>
              <p className="text-slate-400 font-medium">Administra los niveles de acceso y permisos del ecosistema</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-2 rounded-2xl flex items-center gap-3">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Seguridad de Nivel 4 Activa</span>
            </div>
          </div>

          {/* BARRA DE HERRAMIENTAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar usuario por nombre o correo..."
                className="w-full bg-slate-900/50 border border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
              <Filter className="w-5 h-5 text-orange-500" />
              FILTRAR POR ROL
            </button>
          </div>

          {/* TABLA DE USUARIOS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                    <th className="px-6">Usuario</th>
                    <th>Correo Electrónico</th>
                    <th>Rol Actual</th>
                    <th>Última Conexión</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <UserRow
                    name="José Vallejo"
                    email="jose123@hotmail.com"
                    role="Admin"
                    lastActive="Hace 2 min"
                    status="Online"
                  />
                  <UserRow
                    name="Brian Mauss"
                    email="maussbrian06@gmail.com"
                    role="Admin"
                    lastActive="Hace 5 min"
                    status="Online"
                  />
                  <UserRow
                    name="Carlos Mendoza"
                    email="c.mendoza@travel.com"
                    role="Agente"
                    lastActive="Ayer, 14:20"
                    status="Offline"
                  />
                  <UserRow
                    name="Lucía Fernández"
                    email="lucia.fer@gmail.com"
                    role="Cliente"
                    lastActive="Hace 3 días"
                    status="Offline"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function UserRow({ name, email, role, lastActive, status }: any) {
  // Colores para las etiquetas de roles
  const roleStyles: any = {
    "Admin": "bg-orange-500/20 text-orange-500 border-orange-500/30",
    "Agente": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Cliente": "bg-slate-800 text-slate-400 border-slate-700"
  };

  return (
    <tr className="bg-slate-800/20 hover:bg-slate-800/40 transition-all group">
      <td className="px-6 py-5 rounded-l-3xl border-l border-t border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-black text-orange-500 shadow-inner">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-white italic">{name}</p>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'Online' ? 'bg-green-500' : 'bg-slate-600'}`}></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{status}</p>
            </div>
          </div>
        </div>
      </td>
      <td className="font-bold text-slate-300 text-sm">{email}</td>
      <td>
        <select className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${roleStyles[role]}`}>
          <option value="Admin">Admin</option>
          <option value="Agente">Agente</option>
          <option value="Cliente">Cliente</option>
        </select>
      </td>
      <td className="text-xs font-bold text-slate-500 italic">{lastActive}</td>
      <td className="px-6 rounded-r-3xl border-r border-t border-b border-slate-800/50 text-right">
        <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white">
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}