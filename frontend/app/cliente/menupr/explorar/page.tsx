"use client";

import React, { useState, useMemo } from 'react';
import { Star, Globe, ChevronRight, Search, MapPin } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';

const DESTINOS_DATA = [
  { id: 1, ciudad: "Madrid", pais: "España", rating: 4.8, descripcion: "Capital de España, rica en historia y arte.", precio_desde: 10500, popular: true },
  { id: 2, ciudad: "París", pais: "Francia", rating: 4.9, descripcion: "La ciudad luz y hogar de la Torre Eiffel.", precio_desde: 12200, popular: true },
  { id: 3, ciudad: "Tokio", pais: "Japón", rating: 4.9, descripcion: "Tecnología y tradición en un solo lugar.", precio_desde: 15800, popular: true },
  { id: 4, ciudad: "Nueva York", pais: "Estados Unidos", rating: 4.7, descripcion: "La gran manzana te espera.", precio_desde: 6500, popular: true }
];

export default function ExplorarDestinos() {
  const [busqueda, setBusqueda] = useState('');

  const destinosFiltrados = useMemo(() =>
    DESTINOS_DATA.filter(d => d.ciudad.toLowerCase().includes(busqueda.toLowerCase()) || d.pais.toLowerCase().includes(busqueda.toLowerCase())),
  [busqueda]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <SidebarCliente />
      <main className="flex-1 p-12 overflow-y-auto">
        <HeaderUsuario />
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Explorar Destinos</h2>
        <p className="text-slate-500 font-medium mb-10 italic">Descubre tu próximo destino favorito</p>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10 flex gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Buscar ciudad o país..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl font-bold outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {destinosFiltrados.map((destino) => (
            <div key={destino.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group hover:shadow-2xl transition-all duration-500">
              <div className="h-64 bg-slate-100 relative flex items-center justify-center">
                <Globe className="w-16 h-16 text-slate-200" />
                {destino.popular && <div className="absolute top-6 right-6 bg-[#4d7c44] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Popular</div>}
              </div>
              <div className="p-8">
                <div className="flex justify-between mb-4">
                  <div><h3 className="text-2xl font-black text-slate-900">{destino.ciudad}</h3><p className="text-slate-400 font-bold text-sm"><MapPin className="w-3 h-3" /> {destino.pais}</p></div>
                  <div className="flex items-center gap-1 text-orange-400"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-black text-slate-900">{destino.rating}</span></div>
                </div>
                <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{destino.descripcion}</p>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <div><p className="text-[10px] font-black text-slate-400 uppercase">Desde</p><p className="text-2xl font-black text-slate-900">${destino.precio_desde.toLocaleString()}</p></div>
                  <button className="bg-[#4d7c44] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-green-800 transition-all">Ver vuelos <ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}