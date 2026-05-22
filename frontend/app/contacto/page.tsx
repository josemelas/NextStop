import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactoPage() {
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
        <div className="bg-white rounded-[3rem] shadow-xl p-10 md:p-16 border border-slate-100 flex flex-col md:flex-row gap-12">

          <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase mb-4">
              Ponte en <span className="text-orange-500">Contacto</span>
            </h1>
            <p className="text-slate-500 mb-8">
              ¿Tienes dudas sobre nuestra integración API, quieres registrar tu agencia o necesitas soporte con tus boletos? Nuestro equipo está listo para ayudarte.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Correo Electrónico</p>
                  <p className="font-bold text-slate-700">soporte@nextstop.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Teléfono Directo</p>
                  <p className="font-bold text-slate-700">+52 (229) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Oficinas Centrales</p>
                  <p className="font-bold text-slate-700">Instituto Tecnológico de Veracruz</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario Estético (Sin funcionalidad por ahora) */}
          <div className="flex-1 bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight mb-6">Envíanos un mensaje</h3>
            <form className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
                <input type="text" className="w-full mt-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 transition-colors" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo</label>
                <input type="email" className="w-full mt-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 transition-colors" placeholder="tu@correo.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mensaje</label>
                <textarea rows={4} className="w-full mt-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 transition-colors resize-none" placeholder="¿En qué te podemos ayudar?"></textarea>
              </div>
              <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black italic p-4 rounded-xl transition-colors uppercase">
                Enviar Mensaje
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}