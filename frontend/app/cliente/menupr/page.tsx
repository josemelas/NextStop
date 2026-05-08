"use client";

import React, { useState, useMemo } from 'react';
import { Plane, Search, Calendar, ChevronRight, ListFilter, Star, Loader2, MapPin, Globe } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { vuelosService } from '@/lib/vuelosService';

export default function BuscarVuelos() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [orden, setOrden] = useState('Precio (menor)');
  const [vuelosReales, setVuelosReales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaHecha, setBusquedaHecha] = useState(false);

  // Función para llamar a la API de Brian
  const handleBuscar = async () => {
    if (!origen || !destino || !fecha) {
        alert("Por favor completa origen (IATA), destino (IATA) y fecha.");
        return;
    }

    setIsLoading(true);
    setBusquedaHecha(false);

    try {
      // Llamada al backend real
      const data = await vuelosService.buscarVuelosReales(origen, destino, fecha);

      // Amadeus suele devolver un array en 'data'
      const resultados = data.data || data;

      if (Array.isArray(resultados)) {
        setVuelosReales(resultados);
      } else {
        setVuelosReales([]);
      }
      setBusquedaHecha(true);
    } catch (err) {
      console.error("Error buscando vuelos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ordenamiento dinámico de los resultados de Amadeus
  const resultadosFinales = useMemo(() => {
    let data = [...vuelosReales];
    if (orden === 'Precio (menor)') {
      data.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
    }
    return data;
  }, [vuelosReales, orden]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <SidebarCliente />
      <main className="flex-1 p-12 overflow-y-auto">
        <HeaderUsuario />

        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Buscar Vuelos</h2>
                <p className="text-slate-400 font-bold">Datos en tiempo real vía Amadeus API</p>
            </div>
        </div>

        {/* BUSCADOR REAL */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Origen (IATA)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text" placeholder="Ej: MEX" value={origen}
                  onChange={(e) => setOrigen(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 p-5 pl-12 rounded-2xl font-black border-none focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Destino (IATA)</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text" placeholder="Ej: MAD" value={destino}
                  onChange={(e) => setDestino(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 p-5 pl-12 rounded-2xl font-black border-none focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Fecha de Salida</label>
              <input
                type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Pasajeros</label>
              <select className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none cursor-not-allowed">
                <option>1 Adulto</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleBuscar}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-2xl font-black shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Buscar"}
              </button>
            </div>
          </div>
        </div>

        {/* FILTROS Y CONTADOR */}
        <div className="flex justify-between items-center mb-10 px-4">
          <p className="text-slate-400 font-bold">{resultadosFinales.length} opciones encontradas</p>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <ListFilter className="w-4 h-4 text-slate-400" />
            <select value={orden} onChange={(e) => setOrden(e.target.value)} className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none">
              <option value="Precio (menor)">Precio (menor)</option>
            </select>
          </div>
        </div>

        {/* RENDERIZADO DE RESULTADOS DE AMADEUS */}
        <div className="space-y-6">
          {isLoading && (
            <div className="py-20 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-slate-500 font-bold italic">Consultando disponibilidad real...</p>
            </div>
          )}

          {busquedaHecha && resultadosFinales.length > 0 ? (
            resultadosFinales.map((vuelo, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="flex-1 p-10">
                  <div className="flex justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">
                        {vuelo.itineraries[0].segments[0].carrierCode}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded uppercase tracking-tighter">Verified</span>
                      </div>
                    </div>
                    <span className="bg-orange-50 text-orange-700 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest">Amadeus Real-Time</span>
                  </div>

                  <div className="flex items-center justify-between px-4">
                    <div className="text-center">
                      <p className="text-3xl font-black text-slate-900">
                        {vuelo.itineraries[0].segments[0].departure.at.split('T')[1].substring(0,5)}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{origen}</p>
                    </div>

                    <div className="flex-1 px-14 flex flex-col items-center">
                      <div className="w-full flex items-center gap-2">
                        <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                        <Plane className="w-6 h-6 text-orange-500 rotate-45" />
                        <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                      </div>
                      <p className="text-[11px] font-black text-orange-600 uppercase mt-2">
                        {vuelo.itineraries[0].duration.replace('PT','').toLowerCase()}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-black text-slate-900">
                        {vuelo.itineraries[0].segments[0].arrival.at.split('T')[1].substring(0,5)}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{destino}</p>
                    </div>
                  </div>
                </div>

                <div className="w-80 bg-slate-50/80 border-l border-slate-100 p-10 flex flex-col justify-center items-center">
                  <div className="text-center mb-8">
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">
                      ${vuelo.price.total}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase mt-2">{vuelo.price.currency} / Final</p>
                  </div>
                  <button className="w-full bg-[#4d7c44] text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-lg hover:bg-green-800 transition-all">
                    Seleccionar <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : busquedaHecha && !isLoading && (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold italic">No se encontraron vuelos para esta ruta en Amadeus.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}