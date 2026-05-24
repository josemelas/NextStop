"use client";

import React, { useState, useEffect } from 'react';
import { PlaneTakeoff, LayoutDashboard, PlusCircle, FolderGit2, BarChart3, Building2, LogOut } from 'lucide-react';
import Link from 'next/link';

// Importación de los nuevos componentes modulares
import PanelPrincipal from './components/PanelPrincipal';
import MisVuelos from './components/MisVuelos';
import AgregarVuelo from './components/AgregarVuelo';

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
      setUserInfo(JSON.parse(userDataStr));
    }
  }, []);

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

      {/* ÁREA DE CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-10 font-sans min-h-screen">
          {activeItem === 'Panel Principal' && (
            <PanelPrincipal userInfo={userInfo} setActiveItem={setActiveItem} />
          )}
          {activeItem === 'Mis Vuelos' && (
            <MisVuelos userInfo={userInfo} setActiveItem={setActiveItem} />
          )}
          {activeItem === 'Agregar Vuelo' && (
            <AgregarVuelo userInfo={userInfo} setActiveItem={setActiveItem} />
          )}

          {/* Secciones secundarias en construcción */}
          {(activeItem === 'Estadísticas' || activeItem === 'Perfil de Agencia') && (
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