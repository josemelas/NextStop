"use client";

import React, { useState, useEffect } from 'react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { Ticket, QrCode, Calendar, MapPin, Plane, Loader2, AlertCircle } from 'lucide-react';
import { reservasService } from '@/lib/reservasService';

export default function MisBoletos() {
  const [boletos, setBoletos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarHistorialReal() {
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
            console.error("Error al parsear el user_data", e);
          }
        }

        if (!usuarioIdReal) {
          setError("No se pudo identificar tu sesión de usuario. Intenta reingresar.");
          setLoading(false);
          return;
        }

        const res = await reservasService.listarReservas(usuarioIdReal);

        if (res.status === 200 && Array.isArray(res.data)) {
          setBoletos(res.data);
        } else {
          setError("Hubo un problemita al recuperar tus pases de abordar desde el servidor.");
        }
      }
      setLoading(false);
    }

    cargarHistorialReal();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <SidebarCliente />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <HeaderUsuario />

        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase italic">Mis Boletos</h2>
          <p className="text-slate-400 font-bold mb-10 tracking-wide uppercase text-xs">Tus pases de abordar listos para el despegue</p>

          {/* ESTADO DE CARGA */}
          {loading && (
            <div className="text-center py-20 bg-white rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
              <p className="text-slate-400 font-bold italic text-sm">Consultando pases de abordar en NextStop...</p>
            </div>
          )}

          {/* MENSAJE DE ERROR */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-[2.5rem] flex items-center gap-4 text-red-600 mb-8 shadow-sm">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          {/* CONTENEDOR PRINCIPAL */}
          {!loading && !error && (
            <>
              {boletos.length === 0 ? (
                <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-200 text-center shadow-sm">
                  <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-pulse" />
                  <p className="text-slate-400 font-black italic text-lg">Aún no tienes boletos comprados.</p>
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mt-1">Busca un vuelo y completa tu pago para generar un pase</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {boletos.map((boleto, idx) => {
                    const fechaSalidaVuelo = new Date(boleto.vuelo.fecha_salida);
                    const fechaFormateada = fechaSalidaVuelo.toLocaleDateString('es-MX', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    });
                    const horaFormateada = fechaSalidaVuelo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-300"
                      >
                        {/* LADO IZQUIERDO: DETALLES DEL TICKET */}
                        <div className="flex-1 p-8 space-y-6 relative">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${boleto.estado_pago === 'PAGADO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                                {boleto.estado_pago}
                              </span>
                              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                                Cod: {boleto.codigo_confirmacion}
                              </span>
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{boleto.vuelo.aerolinea}</span>
                          </div>

                          {/* ✈️ CONTENIDO DE LA RUTA MODIFICADO CON TUS ATRIBUTOS DESGLOSADOS */}
                          <div className="flex items-center gap-6">
                            {/* BLOQUE ORIGEN */}
                            <div className="min-w-[120px]">
                              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{boleto.vuelo.origen_codigo}</p>
                              <p className="text-[11px] font-bold text-slate-500 mt-1 max-w-[140px] truncate" title={boleto.vuelo.origen_nombre}>{boleto.vuelo.origen_nombre}</p>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Salida</p>
                            </div>

                            {/* LÍNEA DE AVIÓN DIVISORA */}
                            <div className="flex-1 border-b-2 border-dashed border-slate-200 pb-2 flex items-center justify-center relative">
                              <Plane className="w-5 h-5 text-orange-500 absolute -bottom-2.5 bg-white px-0.5" />
                            </div>

                            {/* BLOQUE DESTINO */}
                            <div className="min-w-[120px] text-right">
                              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{boleto.vuelo.destino_codigo}</p>
                              <p className="text-[11px] font-bold text-slate-500 mt-1 max-w-[140px] truncate inline-block" title={boleto.vuelo.destino_nombre}>{boleto.vuelo.destino_nombre}</p>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5 block">Destino</p>
                            </div>
                          </div>

                          {/* Metadatos del Viaje */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 font-bold text-xs text-slate-500">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 font-black uppercase block">Fecha de Vuelo</span>
                              <p className="text-slate-800 capitalize text-sm font-black">{fechaFormateada}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 font-black uppercase block">Hora de Abordaje</span>
                              <p className="text-slate-800 text-sm font-black">{horaFormateada} HRS</p>
                            </div>
                            <div className="space-y-1 col-span-2 md:col-span-1">
                              <span className="text-[10px] text-slate-400 font-black uppercase block">Asiento(s)</span>
                              <p className="text-orange-500 text-sm font-black tracking-wider uppercase">{boleto.asiento_asignado || 'Por asignar'}</p>
                            </div>
                          </div>
                        </div>

                        {/* LADO DERECHO: DETALLES EXTRA Y CÓDIGO QR */}
                        <div className="bg-slate-50 p-8 border-t-2 border-dashed md:border-t-0 md:border-l-2 border-slate-200 flex flex-col items-center justify-center min-w-[200px] text-center relative">
                          <div className="hidden md:block absolute -top-3 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100"></div>
                          <div className="hidden md:block absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100"></div>

                          <div className="p-4 bg-white rounded-3xl border border-slate-200/60 shadow-md mb-3 group-hover:scale-105 transition-all duration-300">
                            <QrCode className="w-24 h-24 text-slate-900" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pase de Abordaje Digital</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-1">{boleto.cantidad_pasajeros} Pasajero{boleto.cantidad_pasajeros > 1 ? 's' : ''}</p>
                          <p className="text-[11px] font-black text-[#4d7c44] mt-2">${parseFloat(boleto.monto_total).toLocaleString()} MXN</p>
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