"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminGuard';
import { adminService } from '@/lib/adminService'; // Importamos el nuevo servicio
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { Shield, Search, Filter, Trash2, RefreshCw, Loader2 } from 'lucide-react';

export default function GestionRolesReal() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Verificación de Seguridad
  useEffect(() => {
    if (!isAdmin()) {
      router.push('/cliente/menupr');
    } else {
      setAuthorized(true);
      cargarUsuarios();
    }
  }, [router]);

  // 2. Cargar usuarios desde el backend
  const cargarUsuarios = async () => {
    setLoading(true);
    const token = localStorage.getItem('user_token');
    if (!token) {
        console.error("No hay sesión activa");
        setLoading(false);
        return;
    }
    const data = await adminService.obtenerUsuarios(token);
    if (Array.isArray(data)) {
      setUsuarios(data);
    }
    setLoading(false);
  };

  // 3. Funciones de Gestión
  const handleCambiarRol = async (usuarioId: number, nuevoRol: string) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
        console.error("No hay sesión activa");
        return;
    }
    const res = await adminService.actualizarRoles(usuarioId, [nuevoRol], token);
    if (!res.error) {
      cargarUsuarios(); // Recargamos para confirmar el cambio
    }
  };

  const handleEliminar = async (usuarioId: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre} del sistema?`)) {
      const res = await adminService.eliminarUsuario(usuarioId);
      if (!res.error) {
        cargarUsuarios();
      }
    }
  };

  // 4. Filtrado en tiempo real
  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Gestión de <span className="text-orange-500">Usuarios Reales</span>
              </h1>
              <p className="text-slate-400 font-medium">Sincronizado con la base de datos de NextStop</p>
            </div>
            <button
              onClick={cargarUsuarios}
              className="bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
              RECARGAR
            </button>
          </div>

          {/* BARRA DE HERRAMIENTAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                className="w-full bg-slate-900/50 border border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-2 rounded-2xl flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Base de Datos Conectada</span>
            </div>
          </div>

          {/* TABLA DE USUARIOS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                  <p className="font-black italic text-slate-500 uppercase">Consultando servidores...</p>
                </div>
              ) : (
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                      <th className="px-6">Usuario</th>
                      <th>Correo Electrónico</th>
                      <th>Rol en el Sistema</th>
                      <th>Estado</th>
                      <th className="text-right px-6">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <UserRow
                        key={u.id_usuario}
                        id={u.id_usuario}
                        name={u.nombre}
                        email={u.email}
                        role={u.roles[0] || "Cliente"}
                        activo={u.activo}
                        onRoleChange={handleCambiarRol}
                        onDelete={handleEliminar}
                      />
                    ))}
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

function UserRow({ id, name, email, role, activo, onRoleChange, onDelete }: any) {
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
          <p className="font-black text-white italic">{name}</p>
        </div>
      </td>
      <td className="font-bold text-slate-300 text-sm">{email}</td>
      <td>
        <select
          defaultValue={role}
          onChange={(e) => onRoleChange(id, e.target.value)}
          className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${roleStyles[role] || roleStyles["Cliente"]}`}
        >
          <option value="Admin">Admin</option>
          <option value="Agente">Agente</option>
          <option value="Cliente">Cliente</option>
        </select>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-[10px] font-black uppercase text-slate-500">{activo ? 'Activo' : 'Inactivo'}</span>
        </div>
      </td>
      <td className="px-6 rounded-r-3xl border-r border-t border-b border-slate-800/50 text-right">
        <button
          onClick={() => onDelete(id, name)}
          className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}