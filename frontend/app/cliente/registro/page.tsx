import React from 'react';
import { User, Mail, Lock, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClientRegister() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-[500px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 md:p-12">

          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Únete a NextStop</h2>
            <p className="text-slate-500 leading-relaxed text-lg">
              Empieza a planear tu próxima aventura hoy mismo.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Tu nombre" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-accent/20 focus:border-stop-accent outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" placeholder="tu@correo.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-accent/20 focus:border-stop-accent outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" placeholder="Mínimo 8 caracteres" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-accent/20 focus:border-stop-accent outline-none transition-all" />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-stop-accent cursor-pointer" />
              <p className="text-sm text-slate-600">
                Acepto los <span className="text-stop-navy font-bold cursor-pointer hover:underline">términos y condiciones</span> y la <span className="text-stop-navy font-bold cursor-pointer hover:underline">política de privacidad</span>
              </p>
            </div>

            <button type="submit" className="w-full bg-stop-accent hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-100 mt-2">
              Crear mi cuenta gratuita
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600 font-medium">
              ¿Ya eres viajero? {' '}
              <Link href="/cliente/login" className="text-stop-accent font-bold hover:underline">
                Entra aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}