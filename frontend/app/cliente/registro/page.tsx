"use client";

import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';

export default function ClientRegister() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      // Modificación: Agregamos recaptcha_token exigido por el backend de Brian
      const data = await authService.registrar({
        nombre,
        email,
        telefono,
        password,
        recaptcha_token: "fake-token" // Bypass del CAPTCHA para desarrollo
      });

      if (data && data.mensaje) {
        setSuccess(true);
        setNombre('');
        setEmail('');
        setTelefono('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const errorMsg = data.error || (data.email ? data.email[0] : "No se pudo crear la cuenta. Revisa los datos.");
        setError(errorMsg);
      }
    } catch (err) {
      setError("Error crítico: No hay conexión con el servidor de NextStop.");
    } finally {
      setIsLoading(false);
    }
  };

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

          {success ? (
            <div className="bg-green-50 border border-green-200 p-8 rounded-[2rem] text-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">¡Registro exitoso!</h3>
              <p className="text-green-700 font-medium">
                Se ha guardado tu perfil correctamente. Hemos enviado un código a <span className="font-bold">{email}</span> para verificar tu cuenta.
              </p>
              <button
                onClick={() => router.push('/cliente/login')}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
              >
                Ir al inicio de sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Número de Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ingresa numero"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    required
                    minLength={8}
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all ${
                      confirmPassword && password !== confirmPassword
                      ? 'border-red-300 ring-red-100'
                      : 'border-slate-200 focus:ring-orange-500/20 focus:border-orange-500'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-orange-500 cursor-pointer" />
                <p className="text-sm text-slate-600">
                  Acepto los <span className="text-slate-900 font-bold cursor-pointer hover:underline">términos y condiciones</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-100 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando cliente...
                  </>
                ) : (
                  "Crear mi cuenta gratuita"
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600 font-medium">
              ¿Ya eres viajero? {' '}
              <Link href="/cliente/login" className="text-orange-500 font-bold hover:underline">
                Entra aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}