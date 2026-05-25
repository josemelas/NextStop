"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactoPage() {
  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Estados para la carga y alertas
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      // Petición al nuevo backend de Brian
      const res = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/usuarios/contacto/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, mensaje }),
      });

      const data = await res.json();

      if (res.ok) {
        // Mostramos el mensaje de éxito que viene desde Django
        setStatusMsg({ type: 'success', text: data.mensaje || '¡Tu mensaje ha sido enviado con éxito!' });

        // Limpiamos el formulario
        setNombre('');
        setCorreo('');
        setMensaje('');

        // Desaparecer el mensaje de éxito después de 5 segundos
        setTimeout(() => setStatusMsg(null), 5000);
      } else {
        // Mostramos el error específico del backend
        setStatusMsg({ type: 'error', text: data.error || 'Ocurrió un error al enviar el mensaje.' });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Error de conexión. Verifica tu internet o intenta más tarde.' });
    } finally {
      setLoading(false);
    }
  };

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
                  <p className="font-bold text-slate-700">nextstopcompany@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Teléfono Directo</p>
                  <p className="font-bold text-slate-700">+52 (229) 231-1401</p>
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

          {/* Formulario Funcional */}
          <div className="flex-1 bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight mb-6">Envíanos un mensaje</h3>

            {/* Alertas de Éxito o Error */}
            {statusMsg && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 font-bold text-sm animate-in fade-in ${statusMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p>{statusMsg.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 transition-colors"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 transition-colors"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mensaje</label>
                <textarea
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="¿En qué te podemos ayudar?"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black italic p-4 rounded-xl transition-colors uppercase flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Mensaje"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}