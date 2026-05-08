"use client";

import React, { useState, useMemo } from 'react';
import { Plane, Search, Calendar, MapPin, ChevronRight, ListFilter, Star, Users } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';

const VUELOS_DATA = [
  { id: 1, aerolinea: "Aeromexico", rating: 4.5, salida: "10:30", llegada: "04:45", origen_cod: "MEX", destino_cod: "MAD", duracion: "11h 15m", tipo: "Directo", precio: 12500, precio_original: 15000, fecha: "2026-05-14", asientos: 45, origen: "México", destino: "España" },
  { id: 2, aerolinea: "Iberia", rating: 4.2, salida: "14:00", llegada: "08:30", origen_cod: "MEX", destino_cod: "BCN", duracion: "12h 30m", tipo: "1 escala", precio: 10800, precio_original: 10800, fecha: "2026-05-14", asientos: 23, origen: "México", destino: "España" },
  { id: 3, aerolinea: "Air France", rating: 4.8, salida: "23:00", llegada: "17:20", origen_cod: "MEX", destino_cod: "CDG", duracion: "11h 20m", tipo: "Directo", precio: 18900, precio_original: 21000, fecha: "2026-05-15", asientos: 12, origen: "México", destino: "Francia" },
  { id: 4, aerolinea: "Lufthansa", rating: 4.7, salida: "18:15", llegada: "11:00", origen_cod: "MEX", destino_cod: "FRA", duracion: "10h 45m", tipo: "Directo", precio: 16400, fecha: "2026-05-14", asientos: 30, origen: "México", destino: "Alemania" }
];

export default function BuscarVuelos() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [orden, setOrden] = useState('Mejor valorado');
  const [vuelosFiltrados, setVuelosFiltrados] = useState<any[]>([]);
  const [busquedaHecha, setBusquedaHecha] = useState(false);

  const paises = ["México", "España", "Estados Unidos", "Japón", "Francia", "Canadá", "Alemania"];

  const handleBuscar = () => {
    if (!origen || !destino) return;
    const resultados = VUELOS_DATA.filter(v => v.origen === origen && v.destino === destino);
    setVuelosFiltrados(resultados);
    setBusquedaHecha(true);
  };

  const resultadosFinales = useMemo(() => {
    let data = [...vuelosFiltrados];
    if (orden === 'Precio (menor)') data.sort((a, b) => a.precio - b.precio);
    if (orden === 'Mejor valorado') data.sort((a, b) => b.rating - a.rating);
    return data;
  }, [vuelosFiltrados, orden]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <SidebarCliente />
      <main className="flex-1 p-12 overflow-y-auto">
        <HeaderUsuario />
        <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Buscar Vuelos</h2>

        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Origen</label>
              <select value={origen} onChange={(e) => setOrigen(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none">
                <option value="">Selecciona origen</option>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Destino</label>
              <select value={destino} onChange={(e) => setDestino(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none">
                <option value="">¿A dónde vas?</option>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Pasajeros</label>
              <select className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none"><option>1 Pasajero</option></select>
            </div>
            <div className="flex items-end">
              <button onClick={handleBuscar} className="w-full bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-2xl font-black shadow-lg transition-all">Buscar</button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-10 px-4">
          <p className="text-slate-400 font-bold">{resultadosFinales.length} vuelos encontrados</p>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <ListFilter className="w-4 h-4 text-slate-400" />
            <select value={orden} onChange={(e) => setOrden(e.target.value)} className="bg-transparent border-none text-sm font-bold text-slate-700">
              <option value="Mejor valorado">Mejor valorado</option>
              <option value="Precio (menor)">Precio (menor)</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {busquedaHecha && resultadosFinales.map((vuelo) => (
            <div key={vuelo.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex overflow-hidden">
              <div className="flex-1 p-10">
                <div className="flex justify-between mb-8">
                  <div><h3 className="text-2xl font-black text-slate-800">{vuelo.aerolinea}</h3><div className="flex items-center gap-1 text-orange-400"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-bold text-slate-400">{vuelo.rating}</span></div></div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest">Económica</span>
                </div>
                <div className="flex items-center justify-between px-4">
                  <div className="text-center"><p className="text-3xl font-black text-slate-900">{vuelo.salida}</p><p className="text-xs font-bold text-slate-400 uppercase">{vuelo.origen} ({vuelo.origen_cod})</p></div>
                  <div className="flex-1 px-14 flex flex-col items-center"><div className="w-full flex items-center gap-2"><div className="flex-1 border-t-2 border-dashed border-slate-200"></div><Plane className="w-6 h-6 text-blue-600 rotate-45" /><div className="flex-1 border-t-2 border-dashed border-slate-200"></div></div><p className="text-[11px] font-black text-blue-600 uppercase mt-2">{vuelo.duracion}</p></div>
                  <div className="text-center"><p className="text-3xl font-black text-slate-900">{vuelo.llegada}</p><p className="text-xs font-bold text-slate-400 uppercase">{vuelo.destino} ({vuelo.destino_cod})</p></div>
                </div>
              </div>
              <div className="w-80 bg-slate-50/80 border-l border-slate-100 p-10 flex flex-col justify-center items-center">
                <div className="text-center mb-8"><p className="text-5xl font-black text-slate-900 tracking-tighter">${vuelo.precio.toLocaleString()}</p><p className="text-[11px] font-bold text-slate-400 uppercase mt-2">MXN / Total</p></div>
                <button className="w-full bg-[#4d7c44] text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all">Seleccionar <ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}