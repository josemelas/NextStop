"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Search, Ticket, Heart, LogOut, User, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAdmin } from '@/lib/adminGuard';

export function SidebarCliente() {
  const pathname = usePathname();
  const showAdmin = isAdmin();

  const links = [
    { name: 'Buscar Vuelos', href: '/cliente/menupr', icon: Search },
    { name: 'Mis Boletos', href: '/cliente/boletos', icon: Ticket },
    { name: 'Favoritos', href: '/cliente/favoritos', icon: Heart },
    { name: 'Mi Perfil', href: '/cliente/perfil', icon: User },
  ];

  if (showAdmin) {
    links.push({ name: 'Gestión de Usuarios', href: '/admin/usuarios', icon: Users });
  }

  return (
    <aside className="w-72 bg-[#1e293b] text-white flex flex-col shadow-2xl sticky top-0 h-screen">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-orange-500 p-2 rounded-xl shadow-lg">
          <Plane className="w-6 h-6 text-white rotate-45" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter">Next<span className="text-orange-500">Stop</span></h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Portal del Viajero</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((item) => {
          const IconoComponente = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                pathname === item.href
                ? 'bg-white/10 text-white border border-white/5 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <IconoComponente className={`w-5 h-5 ${pathname === item.href ? 'text-orange-500' : ''}`} />
              {item.name}
            </Link>
          );
        })}

        {/* BOTÓN DE PANEL PRINCIPAL ADMIN */}
        {showAdmin && (
          <div className="pt-6 mt-6 border-t border-white/10 px-2">
            <Link
              href="/admin/dashboard"
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black italic transition-all ${
                pathname === '/admin/dashboard'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-800 text-orange-500 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              PANEL PRINCIPAL ADMIN
            </Link>
          </div>
        )}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5">
        <Link
          href="/"
          onClick={() => localStorage.clear()}
          className="w-full flex items-center gap-4 text-slate-500 hover:text-red-400 p-4 rounded-2xl font-bold transition-all"
        >
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
}

export function HeaderUsuario() {
  const [nombreMostrar, setNombreMostrar] = useState("Viajero");
  const [inicial, setInicial] = useState("V");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("user_data");
      if (userDataString) {
        try {
          const user = JSON.parse(userDataString);
          if (user && user.nombre) {
            const palabras = user.nombre.trim().split(/\s+/);

            if (palabras.length > 0) {
              const primerNombre = palabras[0].charAt(0).toUpperCase() + palabras[0].slice(1).toLowerCase();
              let nombreCompletoFormateado = primerNombre;

              if (palabras.length > 1) {
                const primerApellido = palabras[1].charAt(0).toUpperCase() + palabras[1].slice(1).toLowerCase();
                nombreCompletoFormateado = `${primerNombre} ${primerApellido}`;
              }

              setNombreMostrar(nombreCompletoFormateado);
              setInicial(primerNombre.charAt(0).toUpperCase());
            }
          }
        } catch (error) {
          console.error("Error al leer el perfil de usuario:", error);
        }
      }
    }
  }, []);

  return (
    <header className="flex justify-between items-center mb-12">
      <div className="invisible italic text-slate-400">Navegación</div>

      <Link
        href="/cliente/perfil"
        className="flex items-center gap-4 bg-white p-3 pr-8 rounded-full shadow-md border border-slate-100 hover:border-orange-500/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
      >
        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-orange-500/20 group-hover:border-orange-500 transition-colors">
          {inicial}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 group-hover:text-orange-500 transition-colors">{nombreMostrar}</p>
        </div>
      </Link>
    </header>
  );
}