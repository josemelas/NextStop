"use client";

import React, { useState, useEffect } from 'react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import { User, Mail, Phone, Lock, Camera, Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { usuariosService } from '@/lib/usuariosService';

export default function MiPerfilCliente() {
  // Estados para los campos del perfil
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para manejo de archivos
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [tokenJWT, setTokenJWT] = useState("");

  // Estados de control de la UI
  const [loading, setLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  // Carga inicial sincronizada con la llave user_token del Login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("user_data");
      const tokenGuardado = localStorage.getItem("user_token") || "";

      setTokenJWT(tokenGuardado);

      if (userDataString) {
        try {
          const user = JSON.parse(userDataString);
          if (user) {
            setNombre(user.nombre || "");
            setEmail(user.email || user.correo || "");
            setTelefono(user.telefono || "");
            setFotoPerfil(user.foto_perfil || null);
          }
        } catch (e) {
          console.error("Error al cargar los datos de perfil desde localStorage", e);
        }
      }
    }
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoFoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion("");
    setMensajeExito("");

    if (!nombre.trim() || !email.trim() || !telefono.trim()) {
      setErrorValidacion("Por favor, rellena todos los campos obligatorios personales.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (password && password !== confirmPassword) {
      setErrorValidacion("Las contraseñas nuevas no coinciden entre sí.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!tokenJWT) {
      setErrorValidacion("Sesión inválida o expirada. Vuelve a iniciar sesión.");
      return;
    }

    setLoading(true);

    const perfilFormData = new FormData();
    perfilFormData.append('nombre', nombre.trim());
    perfilFormData.append('email', email.trim());
    perfilFormData.append('telefono', telefono.trim());

    if (password) {
      perfilFormData.append('password', password);
    }

    if (archivoFoto) {
      perfilFormData.append('foto', archivoFoto);
    }

    const res = await usuariosService.actualizarPerfil(perfilFormData, tokenJWT);

    if (res.status === 200) {
      if (typeof window !== "undefined") {
        const userDataString = localStorage.getItem("user_data");
        let currentUser = userDataString ? JSON.parse(userDataString) : {};

        const usuarioActualizado = {
          ...currentUser,
          nombre: res.data.usuario.nombre,
          email: res.data.usuario.email,
          telefono: res.data.usuario.telefono,
          foto_perfil: fotoPerfil
        };

        localStorage.setItem("user_data", JSON.stringify(usuarioActualizado));
        window.dispatchEvent(new Event('storage'));

        setMensajeExito(res.data.detail || "¡Tu perfil ha sido actualizado con éxito!");
        setPassword("");
        setConfirmPassword("");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setErrorValidacion(res.data.detail || "No se pudieron guardar los cambios en el servidor.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      <SidebarCliente />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <HeaderUsuario />

        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Mi Perfil</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Gestiona tu información personal y de seguridad</p>
          </div>

          {errorValidacion && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm p-5 rounded-3xl flex items-center gap-3 shadow-sm mb-6 animate-pulse">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p>{errorValidacion}</p>
            </div>
          )}

          {mensajeExito && (
            <div className="bg-green-50 border border-green-200 text-green-800 font-bold text-sm p-5 rounded-3xl flex items-center gap-3 shadow-sm mb-6">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p>{mensajeExito}</p>
            </div>
          )}

          <form onSubmit={handleGuardarPerfil} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-20">

            {/* PANEL IZQUIERDO: AVATAR */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-md flex flex-col items-center text-center">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-wider">Foto de Perfil</label>

              <div className="relative w-36 h-36 mb-6 group">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white text-4xl font-black overflow-hidden shadow-xl border-4 border-white ring-4 ring-slate-100">
                  {fotoPerfil ? (
                    <img src={fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    nombre.charAt(0).toUpperCase() || "V"
                  )}
                </div>

                <label className="absolute bottom-1 right-1 bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110 flex items-center justify-center border-2 border-white">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                </label>
              </div>

              <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight mb-1">{nombre || "Viajero"}</h3>
            </div>

            {/* PANEL DERECHO: FORMULARIO */}
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Información Personal</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-sm text-slate-700">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 ml-1">Nombre Completo <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">Correo Electrónico <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">Teléfono de Contacto <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full p-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-1">Seguridad de la Cuenta</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Deja estos campos vacíos si no deseas cambiar tu contraseña actual</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-sm text-slate-700">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full p-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4d7c44] hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest shadow-lg shadow-green-100/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Guardando en Servidor...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Configuración</span>
                  </>
                )}
              </button>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}