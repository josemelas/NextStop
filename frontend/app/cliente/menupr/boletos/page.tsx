"use client";

import React, { useState, useEffect } from 'react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { Ticket, QrCode, Calendar, MapPin, Plane } from 'lucide-react';

export default function MisBoletos() {
  const [boletos, setBoletos] = useState<any[]>([]);

  // Extraemos el historial guardado por el asistente de compras en el localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const historial = localStorage.getItem('historial_boletos');
      if (historial) {
        try {
          setBoletos(JSON.parse(historial));
        } catch (e) {
          console.error("Error al parsear el historial de boletos:", e);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <SidebarCliente />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <HeaderUsuario />

        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase italic">Mis Boletos</h2>
          <p className="text-slate-400 font-bold mb-10 tracking-wide uppercase text-xs">Tus pases de abordar listos para el despegue</p>

          {boletos.length === 0 ? (
            /* TU DISEÑO ORIGINAL EN CASO DE ESTAR VACÍO */
            <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-200 text-center shadow-sm">
              <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-400 font-black italic text-lg">Aún no tienes boletos comprados.</p>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mt-1">Busca un vuelo y completa tu pago para generar un pase</p>
            </div>
          ) : (
            /* LISTADO DINÁMICO DE PASES DE ABORDAR COMPRADOS */
            <div className="space-y-6">
              {boletos.map((boleto, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-300"
                >
                  {/* LADO IZQUIERDO: DETALLES DEL TICKET */}
                  <div className="flex-1 p-8 space-y-6 relative">
                    {/* Encabezado del Ticket */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase tracking-wider">
                          CONFIRMADO
                        </span>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                          Cod: #{boleto.id_compra}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{boleto.aerolinea}</span>
                    </div>

                    {/* Contenido de la Ruta */}
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{boleto.origen}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salida</p>
                      </div>
                      <div className="flex-1 border-b-2 border-dashed border-slate-200 pb-2 flex items-center justify-center relative">
                        <Plane className="w-5 h-5 text-orange-500 absolute -bottom-2.5 bg-white px-0.5" />
                      </div>
                      <div>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{boleto.destino}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destino</p>
                      </div>
                    </div>

                    {/* Metadatos del Viaje */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 font-bold text-xs text-slate-500">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase block">Fecha de Vuelo</span>
                        <p className="text-slate-800 capitalize text-sm font-black">{boleto.fecha.split(',')[1] || boleto.fecha}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase block">Hora de Abordaje</span>
                        <p className="text-slate-800 text-sm font-black">{boleto.hora_salida} HRS</p>
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase block">Asiento(s)</span>
                        <p className="text-orange-500 text-sm font-black tracking-wider">{boleto.asientos.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* LADO DERECHO: SIMULACIÓN DE CÓDIGO QR / LÍNEA DE CORTE */}
                  <div className="bg-slate-50 p-8 border-t-2 border-dashed md:border-t-0 md:border-l-2 border-slate-200 flex flex-col items-center justify-center min-w-[200px] text-center relative">
                    {/* Círculos estéticos simulando corte de ticket físico en pantallas medianas */}
                    <div className="hidden md:block absolute -top-3 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100"></div>
                    <div className="hidden md:block absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100"></div>

                    <div className="p-4 bg-white rounded-3xl border border-slate-200/60 shadow-md mb-3 group-hover:scale-105 transition-all duration-300">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pase de Abordaje Digital</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">{boleto.pasajeros} Pasajero{boleto.pasajeros > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}