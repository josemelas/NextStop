"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Camera, Loader2, CheckCircle2, FileText } from 'lucide-react';

export default function PerfilAgencia({ userInfo }: { userInfo: any }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Cargar los datos iniciales del usuario
  useEffect(() => {
    if (userInfo) {
      setNombre(userInfo.nombres || userInfo.nombre || "");
      setCorreo(userInfo.email || "");
      // Datos simulados si no vienen del backend todavía
      setTelefono(userInfo.telefono || "");
      setDireccion(userInfo.direccion || "");
      setSitioWeb(userInfo.sitio_web || "");
      setDescripcion(userInfo.descripcion || "");
    }
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensajeExito(false);

    // TODO: Aquí irá el fetch real hacia el backend de Brian cuando tenga el endpoint
    // Ejemplo: await fetch('https://seal-app-u4egd.ondigitalocean.app/api/usuarios/proveedor/actualizar/'...)

    // Simulación de carga para la interfaz
    setTimeout(() => {
      setLoading(false);
      setMensajeExito(true);

      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => setMensajeExito(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Perfil de Agencia</h2>
        <p className="text-slate-500 font-medium mt-1">Administra la información pública y de contacto de tu empresa de viajes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: FOTO DE PERFIL / LOGO */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <div className="w-32 h-32 bg-[#4d7c44]/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                {nombre ? (
                  <span className="text-5xl font-black text-[#4d7c44]">{nombre.charAt(0).toUpperCase()}</span>
                ) : (
                  <Building2 className="w-12 h-12 text-[#4d7c44]" />
                )}
              </div>
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 bg-[#4d7c44] p-2.5 rounded-full border-4 border-white text-white shadow-sm">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-black text-lg text-slate-900">{nombre || 'Mi Agencia'}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Socio Proveedor</p>
            <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors border border-slate-200">
              Cambiar Logotipo
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO DE DATOS */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">

            {mensajeExito && (
              <div className="absolute top-0 left-0 right-0 bg-green-500 text-white p-3 flex items-center justify-center gap-2 font-bold text-sm animate-in slide-in-from-top-full">
                <CheckCircle2 className="w-5 h-5" /> Información actualizada correctamente.
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mt-2">
              <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Información Comercial</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold text-sm text-slate-700">
              {/* Nombre Comercial */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre de la Agencia</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20 font-bold" required />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20" disabled />
                </div>
                <p className="text-[10px] text-slate-400">El correo de registro no se puede modificar.</p>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Teléfono de Contacto</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+52 123 456 7890" className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20" />
                </div>
              </div>

              {/* Sitio Web */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sitio Web</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="url" value={sitioWeb} onChange={(e) => setSitioWeb(e.target.value)} placeholder="https://www.miagencia.com" className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20" />
                </div>
              </div>

              {/* Sede / Dirección */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sede Principal</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ciudad, País" className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20" />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Descripción de la Agencia</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Cuéntale a los clientes sobre tu agencia, años de experiencia y destinos principales..."
                    rows={4}
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loading} className="bg-[#4d7c44] hover:bg-green-700 text-white px-8 py-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}