"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Globe, Loader2, Search } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { vuelosService } from '@/lib/vuelosService';

export default function BuscadorInteligente() {
  const [origenQuery, setOrigenQuery] = useState('');
  const [destinoQuery, setDestinoQuery] = useState('');
  const [origenFinal, setOrigenFinal] = useState(''); // El código IATA real
  const [destinoFinal, setDestinoFinal] = useState('');

  const [sugerenciasOrigen, setSugerenciasOrigen] = useState([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState([]);
  const [fecha, setFecha] = useState('');
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Lógica para autocompletar Origen
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (origenQuery.length > 2 && !origenFinal) {
        const res = await vuelosService.buscarUbicaciones(origenQuery);
        setSugerenciasOrigen(res);
      } else {
        setSugerenciasOrigen([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [origenQuery, origenFinal]);

  // Lógica para autocompletar Destino
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (destinoQuery.length > 2 && !destinoFinal) {
        const res = await vuelosService.buscarUbicaciones(destinoQuery);
        setSugerenciasDestino(res);
      } else {
        setSugerenciasDestino([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [destinoQuery, destinoFinal]);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origenFinal || !destinoFinal || !fecha) return;
    setLoading(true);
    const res = await vuelosService.buscarVuelosReales(origenFinal, destinoFinal, fecha);
    setVuelos(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <SidebarCliente />
      <main className="flex-1 p-12 overflow-y-auto">
        <HeaderUsuario />

        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-8 italic">¿A dónde quieres ir?</h2>

          <form onSubmit={handleBuscar} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 relative">

            {/* INPUT ORIGEN */}
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Origen</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text" placeholder="Ciudad o Aeropuerto" value={origenQuery}
                  onChange={(e) => { setOrigenQuery(e.target.value); setOrigenFinal(''); }}
                  className="w-full bg-slate-50 p-4 pl-11 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* MENU DE AUTOCOMPLETADO ORIGEN */}
              {sugerenciasOrigen.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 z-50 overflow-hidden">
                  {sugerenciasOrigen.map((s: any, i) => (
                    <button key={i} type="button" onClick={() => { setOrigenFinal(s.codigo); setOrigenQuery(s.nombre); setSugerenciasOrigen([]); }}
                      className="w-full text-left p-4 hover:bg-orange-50 flex justify-between items-center border-b last:border-none"
                    >
                      <span className="font-bold text-sm text-slate-700">{s.nombre}</span>
                      <span className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded-md">{s.codigo}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* INPUT DESTINO */}
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Destino</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text" placeholder="¿A dónde vuelas?" value={destinoQuery}
                  onChange={(e) => { setDestinoQuery(e.target.value); setDestinoFinal(''); }}
                  className="w-full bg-slate-50 p-4 pl-11 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* MENU DE AUTOCOMPLETADO DESTINO */}
              {sugerenciasDestino.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 z-50 overflow-hidden">
                  {sugerenciasDestino.map((s: any, i) => (
                    <button key={i} type="button" onClick={() => { setDestinoFinal(s.codigo); setDestinoQuery(s.nombre); setSugerenciasDestino([]); }}
                      className="w-full text-left p-4 hover:bg-orange-50 flex justify-between items-center border-b last:border-none"
                    >
                      <span className="font-bold text-sm text-slate-700">{s.nombre}</span>
                      <span className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded-md">{s.codigo}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" />
            </div>

            <div className="flex items-end">
              <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl font-black shadow-lg flex justify-center">
                {loading ? <Loader2 className="animate-spin" /> : "Buscar Vuelos"}
              </button>
            </div>
          </form>

          {/* RESULTADOS */}
          <div className="space-y-6">
            {vuelos.map((v: any, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">{v.itineraries[0].segments[0].carrierCode}</div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase">Vuelo Real de Amadeus</p>
                    <h3 className="text-xl font-black text-slate-900 italic">{origenFinal} → {destinoFinal}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-slate-900">${v.price.total} <span className="text-sm font-bold">{v.price.currency}</span></p>
                  <p className="text-[10px] font-black text-orange-500 uppercase">Quedan pocos asientos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}