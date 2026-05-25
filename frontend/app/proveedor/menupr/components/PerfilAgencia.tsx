"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Mail, Phone, Camera, Loader2, CheckCircle2, Lock, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PerfilAgencia({ userInfo }: { userInfo: any }) {
  // Estados de Información Comercial
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  // Estados de Foto de Perfil
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Contraseña
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [showPwdActual, setShowPwdActual] = useState(false);
  const [showPwdNueva, setShowPwdNueva] = useState(false);

  // Estados de Carga y Mensajes
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [msgInfo, setMsgInfo] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [msgPwd, setMsgPwd] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (userInfo) {
      setNombre(userInfo.nombre || userInfo.nombres || "");
      setCorreo(userInfo.email || "");
      setTelefono(userInfo.telefono || "");

      if (userInfo.foto_perfil) {
        // Aseguramos que la URL sea absoluta si viene relativa desde Django
        const urlBase = userInfo.foto_perfil.startsWith('http')
          ? ''
          : 'https://seal-app-u4egd.ondigitalocean.app';
        setFotoUrl(`${urlBase}${userInfo.foto_perfil}`);
      }
    }
  }, [userInfo]);

  // --- LÓGICA DE FOTO DE PERFIL ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFotoUrl(imageUrl);
    }
  };

  // --- LÓGICA DE ACTUALIZACIÓN DE DATOS COMERCIALES ---
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingInfo(true);
    setMsgInfo(null);

    const token = localStorage.getItem('user_token');
    if (!token) {
      setMsgInfo({ type: 'error', text: 'Sesión expirada. Por favor, inicia sesión nuevamente.' });
      setLoadingInfo(false);
      return;
    }

    // Usamos FormData porque podríamos estar enviando un archivo de imagen
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', correo);
    formData.append('telefono', telefono);

    // Coincide con request.FILES['foto'] del backend de Brian
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    try {
      const res = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/usuarios/editar/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
          // No ponemos Content-Type, el navegador lo calcula automáticamente para FormData
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMsgInfo({ type: 'success', text: 'Información comercial actualizada correctamente.' });

        // Sincronizamos el LocalStorage con los datos exactos que nos regresa el backend
        if (data.usuario) {
           localStorage.setItem('user_data', JSON.stringify(data.usuario));

           if (data.usuario.foto_perfil) {
             const urlBase = data.usuario.foto_perfil.startsWith('http') ? '' : 'https://seal-app-u4egd.ondigitalocean.app';
             setFotoUrl(`${urlBase}${data.usuario.foto_perfil}`);
           }
        }

        setTimeout(() => setMsgInfo(null), 4000);
      } else {
        setMsgInfo({ type: 'error', text: data.detail || 'Ocurrió un problema al guardar los datos.' });
      }
    } catch (error) {
      setMsgInfo({ type: 'error', text: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoadingInfo(false);
    }
  };

  // --- LÓGICA DE CAMBIO DE CONTRASEÑA ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgPwd(null);

    if (nuevaPassword !== confirmarPassword) {
      setMsgPwd({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }

    if (nuevaPassword.length < 6) {
      setMsgPwd({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    const token = localStorage.getItem('user_token');
    if (!token) {
      setMsgPwd({ type: 'error', text: 'Sesión expirada. Por favor, inicia sesión nuevamente.' });
      return;
    }

    setLoadingPwd(true);

    try {
      const res = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/usuarios/editar/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password_actual: passwordActual, // Según la estructura compartida por tu compañero
          nueva_password: nuevaPassword,   // Según la imagen de instrucciones
          password: nuevaPassword          // Según el código python (data.get('password'))
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMsgPwd({ type: 'success', text: 'Contraseña actualizada por motivos de seguridad.' });
        setPasswordActual("");
        setNuevaPassword("");
        setConfirmarPassword("");
        setTimeout(() => setMsgPwd(null), 4000);
      } else {
        setMsgPwd({ type: 'error', text: data.detail || 'Error al cambiar la contraseña.' });
      }
    } catch (error) {
      setMsgPwd({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Perfil de Agencia</h2>
        <p className="text-slate-500 font-medium mt-1">Administra la información pública y credenciales de acceso de tu empresa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLUMNA IZQUIERDA: FOTO DE PERFIL */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative mb-6 group cursor-pointer"
            >
              <div className="w-32 h-32 bg-[#4d7c44]/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                {fotoUrl ? (
                  <img src={fotoUrl} alt="Logo Agencia" className="w-full h-full object-cover" />
                ) : nombre ? (
                  <span className="text-5xl font-black text-[#4d7c44]">{nombre.charAt(0).toUpperCase()}</span>
                ) : (
                  <Building2 className="w-12 h-12 text-[#4d7c44]" />
                )}
              </div>
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 bg-[#4d7c44] p-2.5 rounded-full border-4 border-white text-white shadow-sm hover:bg-green-700 transition-colors">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <h3 className="font-black text-lg text-slate-900">{nombre || 'Mi Agencia'}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Socio Proveedor</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              Cambiar Logotipo
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIOS */}
        <div className="lg:col-span-2 space-y-8">

          {/* FORMULARIO DE INFORMACIÓN COMERCIAL */}
          <form onSubmit={handleInfoSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
            {msgInfo && (
              <div className={`absolute top-0 left-0 right-0 p-3 flex items-center justify-center gap-2 font-bold text-sm animate-in slide-in-from-top-full ${msgInfo.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {msgInfo.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {msgInfo.text}
              </div>
            )}

            <div className="flex items-center border-b border-slate-100 pb-4 mt-2">
              <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Información Comercial</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold text-sm text-slate-700">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nombre de la Agencia</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20 font-bold" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20 font-bold"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400">Este correo se usará para iniciar sesión.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Teléfono de Contacto</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+52 123 456 7890" className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loadingInfo} className="bg-[#4d7c44] hover:bg-green-700 text-white px-8 py-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none">
                {loadingInfo ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Cambios"}
              </button>
            </div>
          </form>

          {/* FORMULARIO DE SEGURIDAD (CONTRASEÑA) */}
          <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
            {msgPwd && (
              <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm mb-4 animate-in fade-in ${msgPwd.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {msgPwd.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {msgPwd.text}
              </div>
            )}

            <div className="flex items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#4d7c44]" /> Seguridad y Acceso
              </h3>
            </div>

            <div className="space-y-6 font-semibold text-sm text-slate-700">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Contraseña Actual</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPwdActual ? "text" : "password"}
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full p-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20"
                    required
                  />
                  <button type="button" onClick={() => setShowPwdActual(!showPwdActual)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
                    {showPwdActual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nueva Contraseña</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPwdNueva ? "text" : "password"}
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full p-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20"
                      required
                    />
                    <button type="button" onClick={() => setShowPwdNueva(!showPwdNueva)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
                      {showPwdNueva ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirmar Contraseña</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPwdNueva ? "text" : "password"}
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      placeholder="Repite la nueva contraseña"
                      className="w-full p-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4d7c44]/20"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loadingPwd} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none">
                {loadingPwd ? <Loader2 className="w-5 h-5 animate-spin" /> : "Actualizar Contraseña"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}