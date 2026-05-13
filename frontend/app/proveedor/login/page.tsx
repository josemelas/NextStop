"use client";

import React, { useState } from 'react';
import { Building2, ArrowLeft, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProviderLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/usuarios/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos los datos del proveedor y el token en el storage
        localStorage.setItem('user_token', data.access);
        localStorage.setItem('user_data', JSON.stringify(data.usuario));

        // Redirección al menú de proveedor
        router.push('/proveedor/menupr');
      } else {
        setError(data.error || "Credenciales incorrectas para este portal.");
        setPassword('');
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors font-black uppercase text-[10px] tracking-widest"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al inicio
      </Link>

      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 border-2 border-orange-500/20 shadow-lg">
              <Building2 className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Portal <span className="text-orange-500">Socio</span></h2>
            <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest italic">Acceso para Agencias de Viaje</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold italic uppercase animate-pulse">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Correo Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@agencia.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold text-sm italic"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Contraseña</label>
                <a href="#" className="text-[10px] font-black text-orange-500 hover:underline uppercase tracking-widest">Recuperar</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold text-sm italic"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-orange-500 transition-all shadow-lg shadow-slate-200 mt-4 active:scale-[0.98] uppercase italic tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Validar Acceso de Socio"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              ¿Tu agencia no es parte de la red? <br />
              <Link href="/proveedor/registro" className="text-orange-500 font-black hover:underline mt-2 inline-block">
                Regístrate como aliado estratégico
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}