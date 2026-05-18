"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Globe, Loader2, AlertCircle } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { vuelosService } from '@/lib/vuelosService';

export default function BuscadorVuelosNextStop() {
  // Estados para inputs y búsqueda
  const [origenQuery, setOrigenQuery] = useState('');
  const [destinoQuery, setDestinoQuery] = useState('');
  const [origenFinal, setOrigenFinal] = useState(''); // Código IATA (ej: MEX)
  const [destinoFinal, setDestinoFinal] = useState('');
  const [fecha, setFecha] = useState('');

  // Estados para la lógica de la UI
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState<any[]>([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState<any[]>([]);
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Autocompletado para ORIGEN
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (origenQuery.length > 2 && !origenFinal) {
        const res = await vuelosService.buscarUbicaciones(origenQuery);
        setSugerenciasOrigen(Array.isArray(res) ? res : []);
      } else {
        setSugerenciasOrigen([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [origenQuery, origenFinal]);

  // Autocompletado para DESTINO
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (destinoQuery.length > 2 && !destinoFinal) {
        const res = await vuelosService.buscarUbicaciones(destinoQuery);
        setSugerenciasDestino(Array.isArray(res) ? res : []);
      } else {
        setSugerenciasDestino([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [destinoQuery, destinoFinal]);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origenFinal || !destinoFinal || !fecha) {
      setError("Por favor, selecciona una ciudad de la lista de sugerencias.");
      return;
    }

    setLoading(true);
    setError("");
    setVuelos([]);

    const res = await vuelosService.buscarVuelosReales(origenFinal, destinoFinal, fecha);

    if (res.error) {
      setError("Hubo un error al consultar vuelos. Intenta más tarde.");
    } else if (Array.isArray(res) && res.length === 0) {
      setError("No se encontraron vuelos disponibles para esta ruta o fecha.");
    } else {
      setVuelos(res);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <SidebarCliente />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <HeaderUsuario />

        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Explorar Vuelos</h2>
            <p className="text-slate-400 font-bold">Reserva viajes reales con tecnología Amadeus</p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleBuscar} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 relative">

            {/* ORIGEN */}
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Origen</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text" placeholder="Ciudad de salida" value={origenQuery}
                  onChange={(e) => { setOrigenQuery(e.target.value); setOrigenFinal(''); }}
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl font-black outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              {sugerenciasOrigen.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 z-50 overflow-hidden">
                  {sugerenciasOrigen.map((s, i) => (
                    <button key={i} type="button" onClick={() => { setOrigenFinal(s.codigo); setOrigenQuery(s.nombre); setSugerenciasOrigen([]); }}
                      className="w-full text-left p-4 hover:bg-orange-50 flex justify-between items-center border-b last:border-none transition-colors">
                      <span className="font-bold text-sm text-slate-700">{s.nombre}</span>
                      <span className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded-md">{s.codigo}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DESTINO */}
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Destino</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text" placeholder="¿A dónde vas?" value={destinoQuery}
                  onChange={(e) => { setDestinoQuery(e.target.value); setDestinoFinal(''); }}
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl font-black outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              {sugerenciasDestino.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 z-50 overflow-hidden">
                  {sugerenciasDestino.map((s, i) => (
                    <button key={i} type="button" onClick={() => { setDestinoFinal(s.codigo); setDestinoQuery(s.nombre); setSugerenciasDestino([]); }}
                      className="w-full text-left p-4 hover:bg-orange-50 flex justify-between items-center border-b last:border-none transition-colors">
                      <span className="font-bold text-sm text-slate-700">{s.nombre}</span>
                      <span className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded-md">{s.codigo}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Fecha</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar Vuelos"}
              </button>
            </div>
          </form>

          {/* MENSAJES DE ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-[2.5rem] flex items-center gap-4 text-red-600 mb-8 animate-pulse">
              <AlertCircle className="w-6 h-6" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          {/* RESULTADOS */}
          <div className="space-y-6 pb-20">
            {vuelos.map((vuelo, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {vuelo.itineraries[0].segments[0].carrierCode}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Amadeus Real-Time</span>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">Vuelo {vuelo.itineraries[0].segments[0].number}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">
                      {origenFinal} <span className="text-orange-500 mx-2">→</span> {destinoFinal}
                    </h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                      Salida: {new Date(vuelo.itineraries[0].segments[0].departure.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} hrs
                    </p>
                  </div>
                </div>

                <div className="text-center md:text-right mt-6 md:mt-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Precio Total</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                    ${vuelo.price.total} <span className="text-lg text-slate-400">{vuelo.price.currency}</span>
                  </p>
                  <button className="bg-[#4d7c44] hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-green-100 uppercase text-xs tracking-widest">
                    Seleccionar Vuelo
                  </button>
                </div>
              </div>
            ))}

            {!loading && vuelos.length === 0 && !error && (
              <div className="text-center py-20 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                <Plane className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-bold italic text-lg tracking-tight">Busca un destino para ver vuelos en tiempo real</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}