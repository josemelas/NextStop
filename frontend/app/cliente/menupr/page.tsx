"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Globe, Loader2, AlertCircle, Star } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { vuelosService } from '@/lib/vuelosService';
import { favoritosService } from '@/lib/favoritosService';
import { useRouter } from 'next/navigation';

export default function BuscadorVuelosNextStop() {
  const router = useRouter();

  // Estados para inputs y búsqueda
  const [origenQuery, setOrigenQuery] = useState('');
  const [destinoQuery, setDestinoQuery] = useState('');
  const [origenFinal, setOrigenFinal] = useState('');
  const [destinoFinal, setDestinoFinal] = useState('');
  const [fecha, setFecha] = useState('');

  // Estados para la lógica de la UI
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState<any[]>([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState<any[]>([]);
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados: Control de favoritos y carga asíncrona individual
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [loadingEstrella, setLoadingEstrella] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

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

  // NUEVO EFFECT: Limpia los resultados y errores visuales si se modifica/borra el origen o destino
  useEffect(() => {
    if (!origenFinal || !destinoFinal) {
      setVuelos([]);
      setError("");
    }
  }, [origenFinal, destinoFinal]);

  // Cargar información de sesión y favoritos del usuario al montar el componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("user_data");
      if (userDataString) {
        try {
          const user = JSON.parse(userDataString);
          if (user && user.id) {
            setUsuarioId(user.id);
            cargarFavoritosIniciales(user.id);
          }
        } catch (e) {
          console.error("Error al leer datos de usuario para el módulo de favoritos", e);
        }
      }
    }
  }, []);

  const cargarFavoritosIniciales = async (id: number) => {
    const favs = await favoritosService.listarFavoritos(id);
    if (Array.isArray(favs)) {
      const ids = favs.filter(f => f.tipo_recurso === 'VUELO').map(f => f.id_recurso);
      setFavoritosIds(ids);
    }
  };

  const handleToggleFavorito = async (vueloApiId: string) => {
    if (!usuarioId) {
      alert("Por favor, inicia sesión para poder agregar vuelos a tus favoritos.");
      return;
    }

    setLoadingEstrella(vueloApiId);
    const yaEsFavorito = favoritosIds.includes(vueloApiId);

    if (yaEsFavorito) {
      const res = await favoritosService.eliminarFavorito(usuarioId, vueloApiId, 'VUELO');
      if (res.status === 200) {
        setFavoritosIds(prev => prev.filter(id => id !== vueloApiId));
      } else {
        alert(res.data?.error || "Ocurrió un inconveniente al remover de favoritos.");
      }
    } else {
      const res = await favoritosService.agregarFavorito(usuarioId, vueloApiId, 'VUELO');
      if (res.status === 201) {
        setFavoritosIds(prev => [...prev, vueloApiId]);
      } else {
        alert(res.data?.error || "Ocurrió un inconveniente al registrar en favoritos.");
      }
    }
    setLoadingEstrella(null);
  };

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
            {vuelos.map((vuelo, idx) => {
              const vueloIdUnico = vuelo.api_id || vuelo.id || `MOCK-${idx}`;
              const esFavorito = favoritosIds.includes(vueloIdUnico);

              return (
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

                  <div className="text-center md:text-right mt-6 md:mt-0 flex flex-col items-center md:items-end justify-center gap-3">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Precio Total</p>
                      <p className="text-5xl font-black text-slate-900 tracking-tighter">
                        ${vuelo.price.total} <span className="text-lg text-slate-400">{vuelo.price.currency}</span>
                      </p>
                    </div>

                    {/* BOTONES DE ACCIÓN AGRUPADOS CON LA ESTRELLA INTERACTIVA */}
                    <div className="flex items-center gap-3 w-full justify-center md:justify-end">

                      {/* BOTÓN ESTRELLA DE FAVORITOS */}
                      <button
                        type="button"
                        onClick={() => handleToggleFavorito(vueloIdUnico)}
                        disabled={loadingEstrella === vueloIdUnico}
                        className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center cursor-pointer disabled:opacity-40"
                        title={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                      >
                        {loadingEstrella === vueloIdUnico ? (
                          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                        ) : (
                          <Star
                            className={`w-5 h-5 transition-transform duration-300 hover:scale-125 ${
                              esFavorito ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                            }`}
                          />
                        )}
                      </button>

                      {/* BOTÓN SELECCIONAR VUELO (WIZARD DE COMPRA) */}
                      <button
                        onClick={() => {
                          const datosVueloParaComprar = {
                            ...vuelo,
                            api_id: vueloIdUnico,
                            origen: origenFinal,
                            destino: destinoFinal,
                            precio: vuelo.precio || (vuelo.price ? parseFloat(vuelo.price.total) : 12500),
                            moneda: vuelo.moneda || (vuelo.price ? vuelo.price.currency : "MXN"),
                            aerolinea: vuelo.aerolinea || vuelo.itineraries[0].segments[0].carrierCode || "Aeroméxico",
                            hora_salida: new Date(vuelo.itineraries[0].segments[0].departure.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                            fecha: new Date(vuelo.itineraries[0].segments[0].departure.at).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                          };
                          localStorage.setItem('vuelo_seleccionado', JSON.stringify(datosVueloParaComprar));
                          router.push('/cliente/menupr/comprar');
                        }}
                        className="bg-[#4d7c44] hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-green-100 uppercase text-xs tracking-widest cursor-pointer flex-1 md:flex-initial"
                      >
                        Seleccionar Vuelo
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* PANTALLA DE INICIO (SI NO HAY VUELOS, CARGA, NI ERRORES) */}
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