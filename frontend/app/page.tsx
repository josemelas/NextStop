"use client";

import React from 'react';
import {
  Plane,
  Search,
  Armchair,
  Ticket,
  Globe,
  BarChart3,
  Users,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* --- NAVBAR AZUL CORPORATIVO (Match con "Next") --- */}
      <nav className="flex items-center justify-between px-12 py-4 bg-[#1e3a8a] text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-2 rounded-lg">
            <Plane className="w-6 h-6 text-white rotate-45" />
          </div>
          <span className="text-2xl font-black tracking-tighter">
            Next<span className="text-orange-400">Stop</span>
          </span>
        </div>

        <div className="flex items-center gap-8 font-medium">
          <a href="#" className="hover:text-orange-300 transition-colors">Destinos</a>
          <a href="#" className="hover:text-orange-300 transition-colors">Nosotros</a>
          <a href="#" className="hover:text-orange-300 transition-colors">Contacto</a>
          <button className="flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full hover:bg-white/20 transition-all font-semibold">
            <UserCircle className="w-5 h-5" />
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="text-center pt-24 pb-16 px-6">
        <h1 className="text-7xl font-black text-[#1e293b] mb-6 tracking-tighter">
          Next<span className="text-orange-500">Stop</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
          Una plataforma inteligente para gestionar y publicar experiencias de viaje.<br />
          Conecta agencias con viajeros de forma fluida.
        </p>
      </section>

      {/* --- TARJETAS DE ACCESO (2 COLUMNAS) --- */}
      <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10 pb-24">

        {/* CARD: PROVEEDOR */}
        <div className="bg-white rounded-[3rem] p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col h-full hover:shadow-2xl transition-all group">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Soy Proveedor</h2>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed font-medium">
            Las agencias de viajes pueden publicar sus mejores vuelos y destinos para llegar a viajeros de todo el mundo.
          </p>
          <ul className="space-y-4 mb-12 flex-1">
            <li className="flex items-center gap-3 text-slate-600 font-semibold">
              <Plane className="w-5 h-5 text-slate-400" /> Publicar vuelos
            </li>
            <li className="flex items-center gap-3 text-slate-600 font-semibold">
              <Globe className="w-5 h-5 text-slate-400" /> Gestionar destinos
            </li>
            <li className="flex items-center gap-3 text-slate-600 font-semibold">
              <BarChart3 className="w-5 h-5 text-slate-400" /> Ver estadísticas
            </li>
          </ul>
          <Link href="/proveedor/login" className="flex items-center justify-between bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg group">
            Entrar al Panel <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CARD: CLIENTE */}
        <div className="bg-white rounded-[3rem] p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col h-full hover:shadow-2xl transition-all group">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Soy Cliente</h2>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed font-medium">
            Busca vuelos, compara precios, reserva asientos y gestiona tus boletos de viaje de forma fácil y segura.
          </p>
          <ul className="space-y-4 mb-12 flex-1">
            <li className="flex items-center gap-3 text-slate-600 font-semibold">
              <Search className="w-5 h-5 text-orange-500" /> Buscador de vuelos
            </li>
            <li className="flex items-center gap-3 text-slate-600 font-semibold">
              <Armchair className="w-5 h-5 text-orange-500" /> Selección de asientos
            </li>
            <li className="flex items-center gap-3 text-slate-600 font-semibold">
              <Ticket className="w-5 h-5 text-orange-500" /> Mis boletos
            </li>
          </ul>
          <Link href="/cliente/login" className="flex items-center justify-between bg-orange-500 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg group">
            Acceder como Cliente <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </main>
  );
}