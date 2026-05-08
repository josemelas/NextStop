"use client";

import React, { useState } from 'react';
import { UserCircle, ArrowLeft, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Llamada real al backend de Brian vía authService
      const { ok, data } = await authService.login(email, password);

      if (ok) {
        // Redirección exitosa al menú principal
        router.push('/cliente/menupr');
      } else {
        // Mostramos el error real del backend (ej: "Correo no verificado" o "Contraseña incorrecta")
        setError(data.error || "Ocurrió un error al iniciar sesión");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor de NextStop.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-stop-accent transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al inicio
      </Link>

      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-2xl mb-4 border border-orange-100">
              <UserCircle className="w-8 h-8 text-stop-accent" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">¡Hola de nuevo!</h2>
            <p className="text-slate-500 mt-2">Ingresa para gestionar tus viajes y reservas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stop-accent/20 focus:border-stop-accent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">Contraseña</label>
                <a href="#" className="text-sm font-medium text-stop-accent hover:underline">¿La olvidaste?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu Contraseña"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stop-accent/20 focus:border-stop-accent transition-all"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none z-10 p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stop-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Comenzar mi viaje"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              ¿Aún no tienes cuenta? <br />
              <Link href="/cliente/registro" className="text-stop-accent font-bold hover:underline">
                Regístrate como viajero aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}