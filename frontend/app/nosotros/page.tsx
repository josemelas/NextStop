import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Globe, ShieldCheck } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans text-slate-800">
      <div className="max-w-4xl w-full">
        {/* Botón de Regreso */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>

        {/* Contenedor Principal */}
        <div className="bg-white rounded-[3rem] shadow-xl p-10 md:p-16 border border-slate-100">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic uppercase mb-4">
              Sobre <span className="text-orange-500">NextStop</span>
            </h1>
            <p className="text-slate-500 text-lg">Revolucionando la forma en que el mundo viaja.</p>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            <p>
              <strong>NextStop</strong> nace de la visión de crear un ecosistema global unificado donde agencias de viajes, aerolíneas y viajeros convergen en una sola plataforma inteligente. Nuestro objetivo es simplificar la gestión y publicación de experiencias de viaje.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-slate-100">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="font-black text-slate-900 uppercase">Conexión Global</h3>
                <p className="text-sm">Integración directa con los sistemas GDS más importantes del mundo.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="font-black text-slate-900 uppercase">Comunidad</h3>
                <p className="text-sm">Uniendo a proveedores verificados con miles de viajeros listos para explorar.</p>
              </div>

              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-black text-slate-900 uppercase">Seguridad</h3>
                <p className="text-sm">Gestión de datos y transacciones protegidas con los más altos estándares.</p>
              </div>
            </div>

            <p className="text-center italic text-slate-400 font-medium">
              "El viaje de mil millas comienza con un solo clic."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}