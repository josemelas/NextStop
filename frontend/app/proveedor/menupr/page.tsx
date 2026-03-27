"use client";

import React, { useState } from 'react';
import {
  PlaneTakeoff,
  LayoutDashboard,
  PlusCircle,
  FolderGit2,
  MapPin,
  DollarSign,
  BarChart3,
  Building2,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import Link from 'next/link';

// Componente para los ítems del menú lateral (Reutilizable)
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active = false }) => {
  return (
    <button
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-white/10 text-white shadow-inner'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-stop-accent' : 'text-slate-400'}`} />
      {label}
    </button>
  );
};

export default function MenuProveedor() {
  const [activeItem, setActiveItem] = useState('Panel Principal');

  // Datos del menú basados en tu imagen
  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel Principal' },
    { icon: PlusCircle, label: 'Agregar Vuelo' },
    { icon: FolderGit2, label: 'Mis Vuelos' },
    { icon: MapPin, label: 'Destinos' },
    { icon: DollarSign, label: 'Precios' },
    { icon: BarChart3, label: 'Estadísticas' },
    { icon: Building2, label: 'Perfil de Agencia' },
    { icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* --- SIDEBAR LATERAL (El Menú solicitado) --- */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col p-6 shadow-2xl border-r border-slate-700/50">

        {/* Header del Sidebar: Logo y Nombre */}
        <div className="flex items-center gap-3 mb-12 px-2 pb-6 border-b border-slate-700/50">
          <div className="bg-stop-accent/10 p-2.5 rounded-xl border border-stop-accent/20">
            <PlaneTakeoff className="w-7 h-7 text-stop-accent" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tighter leading-none">Next<span className="text-stop-accent">Stop</span></h1>
            <span className="text-xs text-slate-400 font-medium tracking-wide mt-1">Portal Proveedor</span>
          </div>
        </div>

        {/* Lista de Navegación principal */}
        <nav className="flex-1 space-y-2.5">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.label}
              onClick={() => setActiveItem(item.label)} // Simulación de cambio
            />
          ))}
        </nav>

        {/* Botón de Cerrar Sesión en la parte inferior */}
        <div className="mt-auto pt-6 border-t border-slate-700/50">
          <Link
            href="/"
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* --- ÁREA DE CONTENIDO PRINCIPAL (Dashboard Simulado) --- */}
      <main className="flex-1">

        {/* Barra superior de acciones (Header del contenido) */}
        <header className="bg-white p-6 border-b border-slate-100 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Bienvenido de nuevo, José</h2>
            <p className="text-slate-500 mt-1">Aquí tienes el resumen de tu negocio de viajes para hoy.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-slate-50 rounded-full shadow-inner border border-slate-200 relative text-slate-500 hover:text-stop-navy hover:bg-slate-100 transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-md"></span>
            </button>
            <div className="flex items-center gap-3.5 border-l border-slate-100 pl-4">
              <div className="w-12 h-12 bg-stop-accent rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg">
                JV
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">José Vallejo</span>
                <span className="text-xs text-slate-500">Agencia SkyWings</span>
              </div>
            </div>
          </div>
        </header>

        {/* Espacio para el contenido dinámico del Dashboard */}
        <div className="p-10">
          <div className="border-4 border-dashed border-slate-200 rounded-[2rem] h-[600px] flex items-center justify-center text-center p-12 bg-white">
            <div className="flex flex-col items-center">
              <BarChart3 className="w-20 h-20 text-slate-200 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Sección {activeItem} en construcción</h3>
              <p className="text-slate-500 max-w-sm">Aquí se mostrarán las estadísticas detalladas y la gestión de tus vuelos.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}