"use client";

import React, { useState, useEffect } from 'react';
import {
  PlaneTakeoff,
  LayoutDashboard,
  PlusCircle,
  FolderGit2,
  BarChart3,
  Building2,
  LogOut,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Plane,
  MapPin,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-[#2b3927] text-white shadow-inner'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-green-400' : 'text-slate-400'}`} />
      {label}
    </button>
  );
};

export default function MenuProveedor() {
  const [activeItem, setActiveItem] = useState('Panel Principal');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para el filtro de estadísticas
  const [mesFiltro, setMesFiltro] = useState('Todos');
  const [anioFiltro, setAnioFiltro] = useState('Todos');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel Principal' },
    { icon: PlusCircle, label: 'Agregar Vuelo' },
    { icon: FolderGit2, label: 'Mis Vuelos' },
    { icon: BarChart3, label: 'Estadísticas' },
    { icon: Building2, label: 'Perfil de Agencia' },
  ];

  useEffect(() => {
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      const user = JSON.parse(userDataStr);
      setUserInfo(user);
      if (!user.id_proveedor) {
        console.error("Acceso denegado: Este usuario no tiene una agencia (id_proveedor) vinculada.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Efecto que re-carga el dashboard cuando cambia el usuario o los filtros
  useEffect(() => {
    if (userInfo?.id_proveedor) {
      cargarDashboard(userInfo.id_proveedor, mesFiltro, anioFiltro);
    }
  }, [userInfo?.id_proveedor, mesFiltro, anioFiltro]);

  const cargarDashboard = async (idProveedor: number, mes: string, anio: string) => {
    setLoading(true);
    try {
      // Construcción dinámica de la URL con los filtros
      let url = `https://seal-app-u4egd.ondigitalocean.app/api/usuarios/proveedor/dashboard/?id_proveedor=${idProveedor}`;
      if (mes !== 'Todos') url += `&mes=${mes}`;
      if (anio !== 'Todos') url += `&anio=${anio}`;

      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al cargar el dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPanelPrincipal = () => {
    if (loading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>;
    }

    if (!dashboardData) {
      return <div className="text-center text-slate-500 mt-20">No se pudo cargar la información del servidor.</div>;
    }

    const { kpis, vuelos_recientes, destinos_principales } = dashboardData;

    return (
      // Se retiró la animación para que el cambio de panel sea estático
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Panel del Proveedor</h2>
            <p className="text-slate-500 font-medium mt-1">Bienvenido de nuevo. Aquí tienes un resumen de tu negocio de viajes.</p>
          </div>

          {/* Filtros de Mes y Año */}
          <div className="flex items-center gap-3">
            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm outline-none cursor-pointer focus:ring-2 focus:ring-green-500/20"
            >
              <option value="Todos">Mes (Todos)</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>

            <select
              value={anioFiltro}
              onChange={(e) => setAnioFiltro(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm outline-none cursor-pointer focus:ring-2 focus:ring-green-500/20"
            >
              <option value="Todos">Año (Todos)</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        {/* Tarjetas de KPIs */}
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

        {/* Tablas Inferiores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vuelos Recientes */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900">Vuelos Recientes</h3>
              <button className="text-sm font-bold text-green-600 hover:text-green-700">Ver todos</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="pb-4 font-bold">Destino</th>
                    <th className="pb-4 font-bold">Precio</th>
                    <th className="pb-4 font-bold">Fecha</th>
                    <th className="pb-4 font-bold text-right pr-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                  {vuelos_recientes?.map((vuelo: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><MapPin className="w-4 h-4"/></div>
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-bold">{vuelo.destino}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{vuelo.aerolinea}</span>
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
                  {(!vuelos_recientes || vuelos_recientes.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-bold">
                        No hay vuelos registrados para este periodo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Destinos Principales */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6">Destinos Principales</h3>
            <div className="space-y-6">
              {destinos_principales?.map((destino: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&h=100&fit=crop" alt={destino.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 leading-tight">{destino.nombre}</span>
                    <span className="text-xs font-bold text-slate-400">{destino.reservas} reservas</span>
                  </div>
                </div>
              ))}
              {(!destinos_principales || destinos_principales.length === 0) && (
                <p className="text-center text-slate-400 font-bold py-4">Sin datos de reservas aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col p-6 shadow-2xl border-r border-slate-700/50 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2 pb-6 border-b border-slate-700/50">
          <div className="bg-[#2b3927] p-2.5 rounded-xl border border-green-900">
            <PlaneTakeoff className="w-7 h-7 text-green-500 rotate-45" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tighter leading-none text-white">Next<span className="text-green-500">Stop</span></h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Portal Proveedor</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2.5">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.label}
              onClick={() => setActiveItem(item.label)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700/50">
          <Link
            href="/"
            onClick={() => localStorage.clear()}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white p-6 border-b border-slate-100 shadow-sm flex justify-between items-center sticky top-0 z-10 font-sans">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight italic">
              Bienvenido de nuevo, {userInfo?.nombres || userInfo?.nombre || 'Socio'}
            </h2>
            <p className="text-slate-500 mt-1 font-medium">Aquí tienes el resumen de tu negocio de viajes para hoy.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Se eliminó el botón de notificaciones (Bell) */}
            <div className="flex items-center gap-3.5 border-slate-100 pl-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-black text-white text-lg shadow-lg">
                {userInfo?.nombre?.charAt(0) || 'P'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">{userInfo?.nombres || userInfo?.nombre || 'Usuario'}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {dashboardData?.agencia?.nombre || 'Agencia Proveedora'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 font-sans">
          {activeItem === 'Panel Principal' ? (
            renderPanelPrincipal()
          ) : (
            <div className="border-4 border-dashed border-slate-200 rounded-[2.5rem] h-[600px] flex items-center justify-center text-center p-12 bg-white">
              <div className="flex flex-col items-center">
                <BarChart3 className="w-20 h-20 text-slate-200 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Sección {activeItem} en construcción</h3>
                <p className="text-slate-500 max-w-sm font-medium">Aquí se mostrarán las herramientas para {activeItem.toLowerCase()}.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}