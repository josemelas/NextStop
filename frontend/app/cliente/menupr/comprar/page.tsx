"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Globe, Loader2, ArrowLeft, Users, CreditCard, User, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { reservasService } from '@/lib/reservasService';

const FILAS_AVION = [
  { numero: 1, asientos: [{ id: '1A', tipo: 'PREMIUM' }, { id: '1B', tipo: 'PREMIUM' }, { id: '1C', tipo: 'OCUPADO' }, { id: '1D', tipo: 'OCUPADO' }, { id: '1E', tipo: 'OCUPADO' }, { id: '1F', tipo: 'PREMIUM' }] },
  { numero: 2, asientos: [{ id: '2A', tipo: 'OCUPADO' }, { id: '2B', tipo: 'OCUPADO' }, { id: '2C', tipo: 'PREMIUM' }, { id: '2D', tipo: 'PREMIUM' }, { id: '2E', tipo: 'OCUPADO' }, { id: '2F', tipo: 'PREMIUM' }] },
  { numero: 3, asientos: [{ id: '3A', tipo: 'OCUPADO' }, { id: '3B', tipo: 'PREMIUM' }, { id: '3C', tipo: 'PREMIUM' }, { id: '3D', tipo: 'PREMIUM' }, { id: '3E', tipo: 'PREMIUM' }, { id: '3F', tipo: 'PREMIUM' }] },
  { numero: 4, asientos: [{ id: '4A', tipo: 'OCUPADO' }, { id: '4B', tipo: 'OCUPADO' }, { id: '4C', tipo: 'PREMIUM' }, { id: '4D', tipo: 'PREMIUM' }, { id: '4E', tipo: 'OCUPADO' }, { id: '4F', tipo: 'PREMIUM' }] },
  { numero: 5, asientos: [{ id: '5A', tipo: 'PREMIUM' }, { id: '5B', tipo: 'PREMIUM' }, { id: '5C', tipo: 'PREMIUM' }, { id: '5D', tipo: 'PREMIUM' }, { id: '5E', tipo: 'PREMIUM' }, { id: '5F', tipo: 'OCUPADO' }] },
  { numero: 6, asientos: [{ id: '6A', tipo: 'OCUPADO' }, { id: '6B', tipo: 'DISPONIBLE' }, { id: '6C', tipo: 'OCUPADO' }, { id: '6D', tipo: 'DISPONIBLE' }, { id: '6E', tipo: 'DISPONIBLE' }, { id: '6F', tipo: 'DISPONIBLE' }] },
  { numero: 7, asientos: [{ id: '7A', tipo: 'OCUPADO' }, { id: '7B', tipo: 'OCUPADO' }, { id: '7C', tipo: 'DISPONIBLE' }, { id: '7D', tipo: 'OCUPADO' }, { id: '7E', tipo: 'DISPONIBLE' }, { id: '7F', tipo: 'DISPONIBLE' }] },
  { numero: 8, asientos: [{ id: '8A', tipo: 'DISPONIBLE' }, { id: '8B', tipo: 'DISPONIBLE' }, { id: '8C', tipo: 'DISPONIBLE' }, { id: '8D', tipo: 'DISPONIBLE' }, { id: '8E', tipo: 'DISPONIBLE' }, { id: '8F', tipo: 'OCUPADO' }] },
  { numero: 9, asientos: [{ id: '9A', tipo: 'DISPONIBLE' }, { id: '9B', tipo: 'DISPONIBLE' }, { id: '9C', tipo: 'DISPONIBLE' }, { id: '9D', tipo: 'OCUPADO' }, { id: '9E', tipo: 'OCUPADO' }, { id: '9F', tipo: 'DISPONIBLE' }] },
];

export default function ReservarVueloWizard() {
  const router = useRouter();
  const [vuelo, setVuelo] = useState<any>(null);
  const [step, setStep] = useState(1);

  const [cantidadPasajeros, setCantidadPasajeros] = useState(1);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);
  const [cargosExtra, setCargosExtra] = useState(0);
  const [datosPasajeros, setDatosPasajeros] = useState<any[]>([]);

  const [loadingCompra, setLoadingCompra] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);

  const [codigoConfirmacionBackend, setCodigoConfirmacionBackend] = useState("");
  const [errorBackend, setErrorBackend] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  useEffect(() => {
    const vueloGuardado = localStorage.getItem('vuelo_seleccionado');
    if (vueloGuardado) {
      try { setVuelo(JSON.parse(vueloGuardado)); } catch (e) { console.error("Error al parsear el vuelo:", e); }
    }
  }, []);

  useEffect(() => {
    setDatosPasajeros(
      Array.from({ length: cantidadPasajeros }).map(() => ({
        nombres: "", apellidos: "", fechaNacimiento: "", nacionalidad: "Mexicana", tipoIdentificacion: "Credencial para votar INE/IFE", correo: "", telefono: "", prefijo: "+52"
      }))
    );
    setErrorValidacion("");
  }, [cantidadPasajeros]);

  if (!vuelo) {
    return (
      <div className="min-h-screen bg-slate-50 flex font-sans">
        <SidebarCliente />
        <main className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
          <p className="text-slate-400 font-bold italic">Cargando datos del vuelo...</p>
        </main>
      </div>
    );
  }

  const origenCodigo = vuelo.origen || "MEX";
  const destinoCodigo = vuelo.destino || "MAD";
  const precioUnidad = vuelo.precio || 12500;
  const moneda = vuelo.moneda || "MXN";
  const aerolinea = vuelo.aerolinea || "Aeroméxico";
  const horaSalida = vuelo.hora_salida || "10:30";
  const fechaMostrar = vuelo.fecha || "domingo, 14 de junio de 2026";

  const precioBaseTotal = precioUnidad * cantidadPasajeros;
  const precioFinalTotal = precioBaseTotal + cargosExtra;

  // --- NUEVAS VALIDACIONES Y MANEJADORES ---
  const handlePhoneChange = (idx: number, valor: string) => {
    let raw = valor.replace(/\D/g, '');
    if (raw.length > 10) raw = raw.slice(0, 10);
    const formatted = raw.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    const nuevosDatos = [...datosPasajeros];
    nuevosDatos[idx].telefono = formatted;
    setDatosPasajeros(nuevosDatos);
  };

  const handleInputChange = (idx: number, campo: string, valor: string) => {
    const nuevosDatos = [...datosPasajeros];
    nuevosDatos[idx][campo] = valor;
    setDatosPasajeros(nuevosDatos);
    if (errorValidacion) setErrorValidacion("");
  };

  const validarPasoPasajeros = () => {
    const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    for (let i = 0; i < datosPasajeros.length; i++) {
      const p = datosPasajeros[i];
      if (!p.nombres.trim() || !p.apellidos.trim() || !regexEmail.test(p.correo)) {
        setErrorValidacion(`Viajero ${i + 1}: Revisa que el nombre y el correo (formato válido) sean correctos.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (p.telefono.replace(/-/g, '').length < 10) {
        setErrorValidacion(`Viajero ${i + 1}: El número telefónico debe ser de 10 dígitos.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }
    return true;
  };

  const toggleAsiento = (asientoId: string, tipo: string) => {
    if (tipo === 'OCUPADO') return;
    if (asientosSeleccionados.includes(asientoId)) {
      setAsientosSeleccionados(asientosSeleccionados.filter(id => id !== asientoId));
      if (tipo === 'PREMIUM') setCargosExtra(prev => prev - 2500);
    } else {
      if (asientosSeleccionados.length >= cantidadPasajeros) {
        alert(`Ya seleccionaste los ${cantidadPasajeros} asientos.`);
        return;
      }
      setAsientosSeleccionados([...asientosSeleccionados, asientoId]);
      if (tipo === 'PREMIUM') setCargosExtra(prev => prev + 2500);
    }
  };

  const ejecutarCompraRealBackend = async () => {
    setLoadingCompra(true);
    setErrorBackend("");

    const payloadReserva = {
      vuelo_id: vuelo.api_id || vuelo.id || "API-MOCK-ID",
      usuario_id: JSON.parse(localStorage.getItem("user_data") || "{}").id || 1,
      cantidad_pasajeros: cantidadPasajeros,
      asientos: asientosSeleccionados.join(', '),
      monto_total: precioFinalTotal
    };

    const res = await reservasService.crearReserva(payloadReserva);
    if (res.status === 201) {
      setCodigoConfirmacionBackend(res.data.codigo_confirmation || res.data.codigo_confirmacion);
      setCompraExitosa(true);
    } else {
      setErrorBackend(res.data.error || "No se pudo completar el cobro.");
    }
    setLoadingCompra(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      <SidebarCliente />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <HeaderUsuario />
        <div className="max-w-6xl mx-auto">
          <Link href="/cliente/menupr" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm mb-6 bg-transparent border-none outline-none cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Volver a resultados
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Reservar Vuelo</h2>

          {/* INDICADOR DE PASOS */}
          <div className="flex items-center justify-center max-w-2xl mx-auto mb-12 relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10"></div>
            <div className="flex justify-between w-full bg-[#f8fafc]">
              {[1,2,3].map((s) => (
                <div key={s} className="flex items-center gap-3 px-4 bg-[#f8fafc]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-[#4d7c44] text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>{s}</div>
                    <span className={`text-xs font-black uppercase tracking-wider ${step === s ? 'text-slate-900' : 'text-slate-400'}`}>{s === 1 ? 'Seleccionar Asiento' : s === 2 ? 'Datos del Pasajero' : 'Pago'}</span>
                </div>
              ))}
            </div>
          </div>

          {compraExitosa ? (
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center max-w-2xl mx-auto mt-10">
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6 animate-bounce" />
              <h3 className="text-3xl font-black text-slate-900 mb-2">¡Vuelo Confirmado!</h3>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-6">Tu pago ha sido procesado de manera segura</p>
              <button onClick={() => router.push('/cliente/menupr')} className="w-full bg-slate-900 hover:bg-orange-500 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest cursor-pointer">Finalizar</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                {errorValidacion && <div className="bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm p-5 rounded-3xl flex items-center gap-3">{errorValidacion}</div>}

                {step === 1 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="font-black mb-4">Selecciona tu Asiento</h3>
                    {FILAS_AVION.map((fila) => (
                        <div key={fila.numero} className="flex gap-2 mb-2 justify-center">
                            {fila.asientos.map((a) => (
                                <button key={a.id} onClick={() => toggleAsiento(a.id, a.tipo)} className={`w-10 h-10 rounded-lg ${asientosSeleccionados.includes(a.id) ? 'bg-green-600' : a.tipo === 'OCUPADO' ? 'bg-slate-800' : 'bg-slate-200'}`}>{a.id}</button>
                            ))}
                        </div>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    {datosPasajeros.map((p, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
                        <input type="text" placeholder="Nombres" value={p.nombres} onChange={(e) => handleInputChange(idx, 'nombres', e.target.value)} className="p-4 bg-slate-50 border rounded-xl" />
                        <input type="text" placeholder="Apellidos" value={p.apellidos} onChange={(e) => handleInputChange(idx, 'apellidos', e.target.value)} className="p-4 bg-slate-50 border rounded-xl" />
                        <input type="email" placeholder="juan@correo.com" value={p.correo} onChange={(e) => handleInputChange(idx, 'correo', e.target.value.toLowerCase().replace(/\s/g, ''))} className="p-4 bg-slate-50 border rounded-xl" />
                        <div className="flex gap-2">
                          <select className="border bg-slate-50 rounded-xl px-2" value={p.prefijo} onChange={(e) => handleInputChange(idx, 'prefijo', e.target.value)}><option>+52</option><option>+1</option><option>+34</option><option>+57</option></select>
                          <input type="text" placeholder="229-231-1401" value={p.telefono} onChange={(e) => handlePhoneChange(idx, e.target.value)} className="p-4 bg-slate-50 border rounded-xl w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step === 3 && ( /* ... Formulario de pago original ... */ )}

                <div className="flex gap-4">
                  {step > 1 && <button onClick={() => setStep(step - 1)} className="bg-slate-200 px-8 py-4 rounded-xl font-bold">Volver</button>}
                  <button onClick={() => { if(step === 2 && !validarPasoPasajeros()) return; step < 3 ? setStep(step + 1) : ejecutarCompraRealBackend(); }} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold flex-1">
                    {step === 3 ? (loadingCompra ? "..." : "Confirmar") : "Continuar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}