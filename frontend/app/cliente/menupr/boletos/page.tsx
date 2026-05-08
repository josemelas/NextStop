"use client";

import React from 'react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { Ticket, QrCode, Download } from 'lucide-react';

export default function MisBoletos() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <SidebarCliente />
      <main className="flex-1 p-12 overflow-y-auto">
        <HeaderUsuario />
        <h2 className="text-4xl font-black text-slate-900 mb-2">Mis Boletos</h2>
        <p className="text-slate-500 font-medium mb-10 italic">Tus pases de abordar listos para el despegue</p>

        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
          <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Aún no tienes boletos comprados.</p>
        </div>
      </main>
    </div>
  );
}