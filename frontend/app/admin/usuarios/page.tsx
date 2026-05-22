"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/adminGuard';
import { adminService } from '@/lib/adminService';
import { HeaderUsuario } from '@/app/components/NavCliente';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  LogOut,
  Search,
  Trash2,
  RefreshCw,
  Loader2
} from 'lucide-react';

export default function GestionRolesReal() {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isAdmin()) {
        router.push('/cliente/menupr');
      } else {
        setAuthorized(true);
        cargarUsuarios();
      }
    }
  }, [router]);

  const cargarUsuarios = async () => {
    setLoading(true);
    const token = localStorage.getItem('user_token');
    if (!token) {
        setLoading(false);
        return;
    }
    const data = await adminService.obtenerUsuarios(token);
    if (Array.isArray(data)) {
      setUsuarios(data);
    }
    setLoading(false);
  };

  // NUEVO: Función para recibir el arreglo completo de roles y mandarlo al servidor
  const handleActualizarRoles = async (usuarioId: number, nuevosRoles: string[]) => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    const res = await adminService.actualizarRoles(usuarioId, nuevosRoles, token);
    if (!res.error) {
      cargarUsuarios();
    }
  };

  const handleEliminar = async (usuarioId: number, nombre: string) => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    if (window.confirm(`¿Estás seguro de eliminar a ${nombre} del sistema?`)) {
      const res = await adminService.eliminarUsuario(usuarioId, token);
      if (!res.error) {
        cargarUsuarios();
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] flex font-sans text-slate-200">

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
            <TrendingUp className="w-5 h-5" />
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
        <div className="mb-8 flex justify-end">
          <Link href="/cliente/perfil" className="flex items-center gap-4 bg-[#1e293b] p-2 pr-6 rounded-full border border-slate-800 hover:border-slate-600 transition-all cursor-pointer">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner uppercase">
               A
            </div>
            <p className="text-sm font-black text-white">Administrador</p>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto space-y-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight italic uppercase">Gestión de Usuarios</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Sincronizado con la base de datos de NextStop</p>
            </div>
            <button
              onClick={cargarUsuarios}
              className="bg-[#1e293b] hover:bg-slate-800 text-slate-300 p-4 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs border border-slate-800"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
              RECARGAR DATA
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar personal por nombre o correo electrónico..."
              className="w-full bg-[#1e293b] border border-slate-800 p-5 pl-12 rounded-3xl outline-none focus:border-slate-600 transition-all font-bold text-sm text-white placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-[#1e293b] rounded-[3rem] border border-slate-800 shadow-sm p-8">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                  <p className="font-black text-xs text-slate-400 uppercase tracking-widest">Consultando servidores...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="pb-4 pl-4">Usuario</th>
                      <th className="pb-4">Correo Electrónico</th>
                      <th className="pb-4">Roles en el Sistema</th>
                      <th className="pb-4">Estado</th>
                      <th className="pb-4 text-right pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm font-semibold text-slate-300">
                    {usuariosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-bold text-xs uppercase">No se encontraron usuarios.</td>
                      </tr>
                    ) : (
                      usuariosFiltrados.map((u) => (
                        <UserRow
                          key={u.id_usuario || u.id}
                          id={u.id_usuario || u.id}
                          name={u.nombre || "Usuario"}
                          email={u.email}
                          roles={u.roles || []}
                          activo={u.activo !== undefined ? u.activo : true}
                          onRolesUpdate={handleActualizarRoles}
                          onDelete={handleEliminar}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function UserRow({ id, name, email, roles, activo, onRolesUpdate, onDelete }: any) {
  // Estandarizamos los roles que vienen de la base de datos a mayúsculas
  const rolesActuales = roles.map((r: string) => r.toUpperCase());
  const rolesDisponibles = ["ADMIN", "AGENCIA", "CLIENTE"];

  // Lógica para encender/apagar un rol con las reglas de negocio
  const handleToggleRole = (rolClickeado: string) => {
    let nuevosRoles = [...rolesActuales];

    if (nuevosRoles.includes(rolClickeado)) {
      // Si el rol ya lo tiene, se lo quitamos
      nuevosRoles = nuevosRoles.filter((r) => r !== rolClickeado);
    } else {
      // Si no lo tiene, se lo agregamos
      nuevosRoles.push(rolClickeado);

      // Regla de Negocio: Si se asigna ADMIN o AGENCIA, forzosamente debe tener CLIENTE
      if ((rolClickeado === "ADMIN" || rolClickeado === "AGENCIA") && !nuevosRoles.includes("CLIENTE")) {
        nuevosRoles.push("CLIENTE");
      }
    }
    onRolesUpdate(id, nuevosRoles);
  };

  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="py-4 pl-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0f172a] border border-slate-800 rounded-full flex items-center justify-center font-black text-slate-400 uppercase shadow-sm">
            {name.charAt(0)}
          </div>
          <p className="font-bold text-white">{name}</p>
        </div>
      </td>
      <td className="py-4 text-slate-400">{email}</td>
      <td className="py-4">
        <div className="flex flex-wrap gap-2">
          {rolesDisponibles.map((rol) => {
            const hasRole = rolesActuales.includes(rol);
            let activeColor = "";

            if (rol === "ADMIN") activeColor = "bg-orange-500/20 text-orange-400 border-orange-500/30";
            if (rol === "AGENCIA") activeColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
            if (rol === "CLIENTE") activeColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

            const inactiveColor = "bg-[#0f172a] text-slate-600 border-slate-800 hover:border-slate-600 hover:text-slate-400";

            return (
              <button
                key={rol}
                onClick={() => handleToggleRole(rol)}
                title={hasRole ? `Quitar rol de ${rol}` : `Asignar rol de ${rol}`}
                className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${hasRole ? activeColor : inactiveColor}`}
              >
                {rol}
              </button>
            );
          })}
        </div>
      </td>
      <td className="py-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
          activo ? 'bg-emerald-950 text-emerald-300 border-emerald-900' : 'bg-red-950 text-red-300 border-red-900'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="py-4 text-right pr-4">
        <button
          onClick={() => onDelete(id, name)}
          className="p-2 bg-red-950/30 hover:bg-red-900/50 text-red-500 rounded-xl transition-all border border-red-900/20"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}