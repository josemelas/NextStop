"use client"; // Formulario interactivo

import React, { useState } from 'react';
import { Building2, ArrowLeft, Lock, Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProviderLogin() {
  // Estados de captura
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // PRUEBA
    const VALID_EMAIL = "jose_12bd@hotmail.com";
    const VALID_PASS = "Jivz2004";

    if (email === VALID_EMAIL && password === VALID_PASS) {
      setError(false);
      // Redirección a carpeta: menupr
      router.push('/proveedor/menupr');
    } else {
      setError(true);
      // Limpiar contraseña
      setPassword('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Botón para volver al Home */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-stop-navy transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al inicio
      </Link>

      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
              <Building2 className="w-8 h-8 text-stop-navy" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Portal Proveedor</h2>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales de socio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5" />
                Correo o contraseña incorrectos.
              </div>
            )}

            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Correo Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="miagencias@deviajes.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stop-navy/20 focus:border-stop-navy transition-all"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">Contraseña</label>
                <a href="#" className="text-sm font-medium text-stop-navy hover:underline">¿Olvidaste tu clave?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stop-navy/20 focus:border-stop-navy transition-all"
                  required
                />
              </div>
            </div>

            {/* Botón Acceder */}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-4 active:scale-[0.98]"
            >
              Iniciar Sesión de Socio
            </button>
          </form>

          {/* Registro */}
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              ¿Tu agencia no está registrada? <br />
              <Link href="/proveedor/registro" className="text-stop-navy font-bold hover:underline">
                Solicita unirte como aliado
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}