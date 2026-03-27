import React from 'react';
import { Building2, Mail, Phone, Lock, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterProvider() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-[600px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 md:p-12">

          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Registrar Agencia</h2>
            <p className="text-slate-500 leading-relaxed">
              Crea una cuenta para tu agencia de viajes y comienza a publicar vuelos
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Nombre de la Agencia</label>
                <input type="text" placeholder="Mi Agencia de Viajes" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-navy/20 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Nombre de Contacto</label>
                <input type="text" placeholder="Nombre contacto" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-navy/20 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Correo electrónico</label>
              <input type="email" placeholder="contacto@miagencia.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-navy/20 outline-none transition-all" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Teléfono</label>
                <input type="text" placeholder="+52 123 456 7890" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-navy/20 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">País</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-navy/20 outline-none text-slate-500 transition-all cursor-pointer">
                  <option>Seleccionar país</option>
                  <option>México</option>
                  <option>España</option>
                  <option>Colombia</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Contraseña</label>
              <div className="relative">
                <input type="password" placeholder="Mínimo 6 caracteres" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-navy/20 outline-none transition-all" />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Confirmar Contraseña</label>
              <div className="relative">
                <input type="password" placeholder="Repite tu contraseña" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-stop-navy/20 outline-none transition-all" />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-stop-navy cursor-pointer" />
              <p className="text-sm text-slate-600">
                Acepto los <span className="text-stop-navy font-bold cursor-pointer hover:underline">términos y condiciones</span> y la <span className="text-stop-navy font-bold cursor-pointer hover:underline">política de privacidad</span>
              </p>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-[#3d6331] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-slate-200 mt-2">
              Crear Cuenta de Agencia
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-700">
              ¿Ya tienes una cuenta? {' '}
              <Link href="/proveedor/login" className="text-stop-navy font-bold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}