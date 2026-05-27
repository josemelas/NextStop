"use client";

import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/lib/authService';

export default function ProveedorRecuperarPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mensaje, setMensaje] = useState("");

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMensaje("");

    // Usamos el servicio centralizado
    const resultado = await authService.solicitarRecuperacion(email);

    if (resultado.mensaje) {
      setStatus('success');
    } else {
      setStatus('error');
      setMensaje(resultado.error || "No se pudo procesar la solicitud.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Link href="/proveedor/login" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Volver al Login
      </Link>

      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
              <Building2 className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recuperar Acceso</h2>
            <p className="text-slate-500 mt-2 font-medium text-sm">Portal Proveedor: Ingresa tu correo corporativo.</p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 p-6 rounded-[2rem] text-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-900 mb-2">¡Correo Enviado!</h3>
              <p className="text-green-700 text-sm font-medium">Revisa tu bandeja de entrada corporativa para continuar.</p>
              <Link href="/proveedor/login">
                <button className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg text-sm">
                  Volver al Login
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRecuperar} className="space-y-6">
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{mensaje}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Correo Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@agencia.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all font-semibold text-slate-700"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar instrucciones"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}