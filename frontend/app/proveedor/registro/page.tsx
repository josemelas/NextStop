"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProviderRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre_empresa: '',
    nombre: '',
    email: '',
    telefono: '',
    pais: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Manejador interceptor para validaciones en tiempo real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validación: Límite de caracteres para la empresa
    if (name === 'nombre_empresa') {
      if (value.length > 50) return;
    }

    // Validación: El Admin solo acepta letras y espacios, límite de 50
    if (name === 'nombre') {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value) || value.length > 50) return;
    }

    // Validación: Formato de teléfono XXX-XXX-XXXX
    if (name === 'telefono') {
      let raw = value.replace(/\D/g, '');
      if (raw.length > 10) raw = raw.slice(0, 10);

      let formatted = raw;
      if (raw.length > 6) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
      } else if (raw.length > 3) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
      }

      setFormData({ ...formData, [name]: formatted });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    // Validaciones explícitas antes del request
    if (!formData.email.includes('@')) {
      return setStatusMsg({ type: 'error', text: "El correo electrónico debe contener un '@'." });
    }

    if (formData.telefono.length !== 12) {
      return setStatusMsg({ type: 'error', text: 'El teléfono debe estar completo (XXX-XXX-XXXX).' });
    }

    if (formData.password !== formData.confirmPassword) {
      return setStatusMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
    }

    if (formData.password.length < 6) {
      return setStatusMsg({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    setLoading(true);

    try {
      const response = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/usuarios/registrarEmpresa/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_empresa: formData.nombre_empresa,
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          pais: formData.pais,
          password: formData.password,
          recaptcha_token: "fake-token"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMsg({ type: 'success', text: data.mensaje });
        setTimeout(() => router.push('/proveedor/login'), 2000);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Error al registrar la agencia' });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'No se pudo conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12 font-sans">
      <div className="w-full max-w-[600px]">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 md:p-12">

          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight italic uppercase">Registrar Agencia</h2>
            <p className="text-slate-500 font-bold italic uppercase text-xs tracking-widest">
              Únete al ecosistema de NextStop y gestiona tus vuelos
            </p>
          </div>

          {statusMsg.text && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm italic uppercase ${
              statusMsg.type === 'success' ? 'bg-green-50 border border-green-100 text-green-600' : 'bg-red-50 border border-red-100 text-red-600'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nombre de la Agencia</label>
                <input name="nombre_empresa" value={formData.nombre_empresa} required type="text" onChange={handleChange} placeholder="Ej. SkyWings Travel" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Admin de la Agencia</label>
                <input name="nombre" value={formData.nombre} required type="text" onChange={handleChange} placeholder="Nombre completo" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Correo corporativo</label>
              <input name="email" value={formData.email} required type="email" onChange={handleChange} placeholder="contacto@agencia.com" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-sm" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Teléfono</label>
                <input name="telefono" value={formData.telefono} required type="text" onChange={handleChange} placeholder="XXX-XXX-XXXX" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Sede</label>
                <select name="pais" value={formData.pais} required onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none text-slate-500 transition-all cursor-pointer font-bold text-sm">
                  <option value="">Seleccionar país</option>
                  <option value="México">México</option>
                  <option value="España">España</option>
                  <option value="Colombia">Colombia</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Contraseña</label>
              <div className="relative">
                <input name="password" value={formData.password} required type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Confirmar</label>
              <input name="confirmPassword" value={formData.confirmPassword} required type={showPassword ? "text" : "password"} onChange={handleChange} placeholder="Repite la contraseña" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-sm" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-orange-500 text-white py-5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-slate-200 mt-4 flex items-center justify-center gap-3 uppercase italic tracking-widest disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Crear Cuenta de Agencia"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              ¿Ya eres socio? {' '}
              <Link href="/proveedor/login" className="text-orange-500 hover:underline ml-1">
                Entra aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}