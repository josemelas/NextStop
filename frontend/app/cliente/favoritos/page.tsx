"use client";

import React, { useState, useEffect } from 'react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { Heart, Plane, Trash2, Loader2, AlertCircle, Calendar, Star } from 'lucide-react';
import { favoritosService } from '@/lib/favoritosService';
import { useRouter } from 'next/navigation';

export default function MisFavoritos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarFavoritosReal();
  }, []);

  const cargarFavoritosReal = async () => {
    setLoading(true);
    setError("");

    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("user_data");
      let usuarioIdReal = null;

      if (userDataString) {
        try {
          const user = JSON.parse(userDataString);
          if (user && user.id) usuarioIdReal = user.id;
        } catch (e) {
          console.error("Error al identificar usuario", e);
        }
      }

      if (!usuarioIdReal) {
        setError("Inicia sesión para ver tus vuelos guardados.");
        setLoading(false);
        return;
      }

      const data = await favoritosService.listarFavoritos(usuarioIdReal);

      if (Array.isArray(data)) {
        setFavoritos(data);
      } else {
        setError("No pudimos conectar con tu lista de favoritos.");
      }
    }
    setLoading(false);
  };

  const handleEliminarFavorito = async (idRecurso: string) => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user_data") || "{}");
      const res = await favoritosService.eliminarFavorito(user.id, idRecurso);

      if (res.status === 200) {
        setFavoritos(prev => prev.filter(f => f.id_recurso !== idRecurso));
      } else {
        alert("No se pudo eliminar el vuelo de tus favoritos.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      <SidebarCliente />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <HeaderUsuario />

        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Mis Favoritos</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Tus vuelos guardados listos para reservar</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
          </div>

          {loading && (
            <div className="text-center py-20 bg-white rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
              <p className="text-slate-400 font-black italic">Sincronizando tus deseos con NextStop...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-[2.5rem] flex items-center gap-4 text-red-600 mb-8">
              <AlertCircle className="w-6 h-6" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {favoritos.length === 0 ? (
                <div className="bg-white p-20 rounded-[4rem] border-2 border-dashed border-slate-200 text-center shadow-sm">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black italic text-xl">Tu lista está vacía.</p>
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mt-2 mb-8">Explora vuelos y presiona la estrella para guardarlos aquí</p>
                  <button
                    onClick={() => router.push('/cliente/menupr')}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-all cursor-pointer"
                  >
                    Ir al buscador
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {favoritos.map((fav) => {
                    const vuelo = fav.detalle;

                    if (!vuelo) return (
                      <div key={fav.id_favorito} className="bg-slate-100 p-6 rounded-[2.5rem] border border-slate-200 opacity-60 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase">Vuelo ya no disponible en el sistema</p>
                          <p className="text-sm font-bold text-slate-500 italic">ID: {fav.id_recurso}</p>
                        </div>
                        <button onClick={() => handleEliminarFavorito(fav.id_recurso)} className="p-3 bg-white rounded-2xl text-red-500 shadow-sm cursor-pointer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );

                    const vueloIdUnico = fav.id_recurso;
                    const fechaSalidaDate = new Date(vuelo.fecha_salida);

                    return (
                      <div key={fav.id_favorito} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg">
                            {vuelo.aerolinea.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Favorito Guardado</span>
                              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">Vuelo {vuelo.codigo_vuelo}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">
                              {vuelo.origen} <span className="text-orange-500 mx-2">→</span> {vuelo.destino}
                            </h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Salida: {fechaSalidaDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} hrs — {fechaSalidaDate.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>

                        <div className="text-center md:text-right mt-6 md:mt-0 flex flex-col items-center md:items-end justify-center gap-3">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Precio Disponible</p>
                            <p className="text-5xl font-black text-slate-900 tracking-tighter">
                              ${parseFloat(vuelo.precio_base).toLocaleString()} <span className="text-lg text-slate-400">MXN</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3 w-full justify-center md:justify-end">
                            {/* BOTÓN TRASH PARA QUITAR DE ESTA LISTA */}
                            <button
                              type="button"
                              onClick={() => handleEliminarFavorito(vueloIdUnico)}
                              className="p-3.5 rounded-2xl bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 text-red-500 shadow-sm transition-all flex items-center justify-center cursor-pointer"
                              title="Quitar de favoritos"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>

                            {/* BOTÓN REALIZAR COMPRA REPLICADO DE MENUPR */}
                            <button
                              onClick={() => {
                                // Reconstruimos la estructura exacta que el Wizard de compra lee para parsear itineraries
                                const datosVueloParaComprar = {
                                  id: vueloIdUnico,
                                  api_id: vueloIdUnico,
                                  origen: vuelo.origen,
                                  destino: vuelo.destino,
                                  precio: parseFloat(vuelo.precio_base),
                                  moneda: "MXN",
                                  aerolinea: vuelo.aerolinea,
                                  hora_salida: fechaSalidaDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                                  fecha: fechaSalidaDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                                  itineraries: [
                                    {
                                      segments: [
                                        {
                                          carrierCode: vuelo.aerolinea.substring(0, 2).toUpperCase(),
                                          number: vuelo.codigo_vuelo,
                                          departure: { at: vuelo.fecha_salida }
                                        }
                                      ]
                                    }
                                  ],
                                  price: { total: vuelo.precio_base, currency: "MXN" }
                                };
                                localStorage.setItem('vuelo_seleccionado', JSON.stringify(datosVueloParaComprar));
                                router.push('/cliente/menupr/comprar');
                              }}
                              className="bg-[#4d7c44] hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-green-100 uppercase text-xs tracking-widest cursor-pointer"
                            >
                              Seleccionar Vuelo
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}