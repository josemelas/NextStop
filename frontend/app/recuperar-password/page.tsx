"use client";

import React, { useState, Suspense } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';

function RecuperarPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. CAPTURAR DATOS DE LA URL (Justo lo que pidió Brian)
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  // Estados del formulario
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mensaje, setMensaje] = useState("");

  const handleGuardarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMensaje("");

    // Validación: que ambas contraseñas coincidan
    if (password !== confirmPassword) {
      setStatus('error');
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // 2. HACER LA PETICIÓN AL BACKEND (Usando el servicio)
    // El authService ya envía el JSON exacto: { uid, token, nueva_password }
    const resultado = await authService.confirmarRecuperacion(uid as string, token as string, password);

    if (resultado.mensaje) {
      setStatus('success');
      // Redirigir al usuario al inicio después de un éxito, como sugirió Brian
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      setStatus('error');
      setMensaje(resultado.error || "El enlace ha expirado o es inválido.");
    }
  };

  // Si alguien entra a la página sin el link completo (sin uid o token)
  if (!uid || !token) {
    return (
      <div className="bg-red-50 border border-red-200 p-8 rounded-[2rem] text-center max-w-md w-full mx-auto">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-900 mb-2">Enlace Inválido</h3>
        <p className="text-red-700 font-medium text-sm">No se encontraron los códigos de seguridad en la URL. Por favor, solicita un nuevo enlace desde el menú de Login.</p>
        <Link href="/">
          <button className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
            Volver al inicio
          </button>
        </Link>
      </div>
    );
  }

  // Pantalla de Éxito
  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-[2rem] text-center max-w-md w-full mx-auto animate-in zoom-in duration-300">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-green-900 mb-2">¡Contraseña Actualizada!</h3>
        <p className="text-green-700 font-medium text-sm">Tu contraseña ha sido cambiada con éxito. Serás redirigido al inicio en unos segundos...</p>
      </div>
    );
  }

  // 3. ARMAR EL FORMULARIO
  return (
    <div className="w-full max-w-[450px] mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Crear Nueva Contraseña</h2>
          <p className="text-slate-500 mt-2 font-medium text-sm">Elige una contraseña segura y no la compartas con nadie.</p>
        </div>

        <form onSubmit={handleGuardarContrasena} className="space-y-6">
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{mensaje}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Nueva Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold text-slate-700"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Confirmar Nueva Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-semibold text-slate-700"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Suspense es obligatorio en Next.js cuando usamos useSearchParams para no romper la app
export default function RestablecerPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Suspense fallback={<div className="flex items-center gap-3 font-bold text-slate-400"><Loader2 className="animate-spin w-5 h-5" /> Cargando sistema de seguridad...</div>}>
        <RecuperarPasswordForm />
      </Suspense>
    </main>
  );
}