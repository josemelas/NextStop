"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Globe, Loader2, ArrowLeft, Users, CreditCard, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    const vueloGuardado = localStorage.getItem('vuelo_seleccionado');
    if (vueloGuardado) {
      try {
        setVuelo(JSON.parse(vueloGuardado));
      } catch (e) {
        console.error("Error al parsear el vuelo:", e);
      }
    }
  }, []);

  useEffect(() => {
    setDatosPasajeros(
      Array.from({ length: cantidadPasajeros }).map(() => ({
        nombres: "", apellidos: "", fechaNacimiento: "", nacionalidad: "Mexicana", pasaporte: "", vencimientoPasaporte: "", correo: "", telefono: ""
      }))
    );
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

  // Extracción limpia y segura desde el objeto empaquetado del storage local
  const origenCodigo = vuelo.origen || "MEX";
  const destinoCodigo = vuelo.destino || "MAD";
  const precioUnidad = vuelo.precio || 12500;
  const moneda = vuelo.moneda || "MXN";
  const aerolinea = vuelo.aerolinea || "Aeroméxico";
  const horaSalida = vuelo.hora_salida || "10:30";
  const fechaMostrar = vuelo.fecha || "domingo, 14 de junio de 2026";

  const precioBaseTotal = precioUnidad * cantidadPasajeros;
  const precioFinalTotal = precioBaseTotal + cargosExtra;

  const handlePasajerosChange = (num: number) => {
    setCantidadPasajeros(num);
    setAsientosSeleccionados([]);
    setCargosExtra(0);
  };

  const handleInputChange = (idx: number, campo: string, valor: string) => {
    const nuevosDatos = [...datosPasajeros];
    nuevosDatos[idx][campo] = valor;
    setDatosPasajeros(nuevosDatos);
  };

  const toggleAsiento = (asientoId: string, tipo: string) => {
    if (tipo === 'OCUPADO') return;

    if (asientosSeleccionados.includes(asientoId)) {
      setAsientosSeleccionados(asientosSeleccionados.filter(id => id !== asientoId));
      if (tipo === 'PREMIUM') setCargosExtra(prev => prev - 2500);
    } else {
      if (asientosSeleccionados.length >= cantidadPasajeros) {
        alert(`Ya seleccionaste los ${cantidadPasajeros} asientos correspondientes a tus pasajeros.`);
        return;
      }
      setAsientosSeleccionados([...asientosSeleccionados, asientoId]);
      if (tipo === 'PREMIUM') setCargosExtra(prev => prev + 2500);
    }
  };

  const ejecutarSimulacionCompra = () => {
    setLoadingCompra(true);
    setTimeout(() => {
      const nuevoBoleto = {
        id_compra: Math.floor(Math.random() * 900000) + 100000,
        aerolinea,
        origen: origenCodigo,
        destino: destinoCodigo,
        hora_salida: horaSalida,
        fecha: fechaMostrar,
        pasajeros: cantidadPasajeros,
        asientos: asientosSeleccionados,
        total: precioFinalTotal,
        moneda,
        detalles_pasajeros: datosPasajeros,
        fecha_compra: new Date().toLocaleDateString()
      };

      const boletosActuales = JSON.parse(localStorage.getItem('historial_boletos') || '[]');
      boletosActuales.push(nuevoBoleto);
      localStorage.setItem('historial_boletos', JSON.stringify(boletosActuales));

      setLoadingCompra(false);
      setCompraExitosa(true);
    }, 2500);
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
              <div className="flex items-center gap-3 px-4 bg-[#f8fafc]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 1 ? 'bg-[#4d7c44] text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>1</div>
                <span className={`text-xs font-black uppercase tracking-wider ${step === 1 ? 'text-slate-900' : 'text-slate-400'}`}>Seleccionar Asiento</span>
              </div>
              <div className="flex items-center gap-3 px-4 bg-[#f8fafc]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 2 ? 'bg-[#4d7c44] text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>2</div>
                <span className={`text-xs font-black uppercase tracking-wider ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>Datos del Pasajero</span>
              </div>
              <div className="flex items-center gap-3 px-4 bg-[#f8fafc]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 3 ? 'bg-[#4d7c44] text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>3</div>
                <span className={`text-xs font-black uppercase tracking-wider ${step === 3 ? 'text-slate-900' : 'text-slate-400'}`}>Pago</span>
              </div>
            </div>
          </div>

          {compraExitosa ? (
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center max-w-2xl mx-auto mt-10">
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6 animate-bounce" />
              <h3 className="text-3xl font-black text-slate-900 mb-2">¡Vuelo Confirmado!</h3>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-6">Tu pago ha sido procesado de manera segura</p>
              <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100 mb-8 space-y-3 font-bold text-sm text-slate-600">
                <p>✈️ <span className="text-slate-900">Ruta:</span> {origenCodigo} → {destinoCodigo}</p>
                <p>👥 <span className="text-slate-900">Pasajeros:</span> {cantidadPasajeros}</p>
                <p>💺 <span className="text-slate-900">Asientos Reservados:</span> {asientosSeleccionados.join(', ')}</p>
                <p>💵 <span className="text-slate-900">Monto Total Cargado:</span> ${precioFinalTotal.toLocaleString()} {moneda}</p>
              </div>
              <button onClick={() => router.push('/cliente/menupr')} className="w-full bg-slate-900 hover:bg-orange-500 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest cursor-pointer">
                Finalizar y volver al menú principal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">

                {/* CARD RESUMEN DEL TRÁYECTO — CORREGIDO TOTALMENTE DINÁMICO */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black bg-[#4d7c44]/10 text-[#4d7c44] px-2 py-0.5 rounded-full uppercase">Económica</span>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">{aerolinea}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{horaSalida}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{origenCodigo}</p>
                      </div>
                      <div className="text-slate-300 font-bold text-xs tracking-widest border-b-2 border-dashed border-slate-200 pb-1 px-4">11h 15m</div>
                      <div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{vuelo.hora_llegada || "04:45"}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{destinoCodigo}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase italic text-right">{fechaMostrar}</p>
                </div>

                {/* PASO 1: MAPA DE ASIENTOS */}
                {step === 1 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-black text-slate-900">¿Cuántos boletos deseas comprar?</p>
                          <p className="text-xs font-bold text-slate-400">Podrás elegir un asiento por cada viajero asignado</p>
                        </div>
                      </div>
                      <select
                        value={cantidadPasajeros}
                        onChange={(e) => handlePasajerosChange(Number(e.target.value))}
                        className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-black text-sm outline-none cursor-pointer text-slate-700"
                      >
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Pasajero{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>

                    <div>
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider mb-4">Selecciona tu Asiento</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 font-bold text-xs text-slate-500">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded"></div> Disponible</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#4d7c44] rounded"></div> Seleccionado</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#1e293b] rounded"></div> Ocupado</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div> Premium (+ $2,500)</div>
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50/30 rounded-[2rem] border border-slate-100/80 flex flex-col items-center">
                      <div className="w-full max-w-sm bg-slate-100 text-center py-2 rounded-t-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Frente del avión</div>
                      <div className="space-y-3 w-full max-w-md">
                        {FILAS_AVION.map((fila) => (
                          <div key={fila.numero} className="flex items-center justify-between gap-2">
                            <div className="flex gap-2 flex-1 justify-end">
                              {fila.asientos.slice(0,3).map((asiento) => {
                                const esSeleccionado = asientosSeleccionados.includes(asiento.id);
                                let claseColor = "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700";
                                if (asiento.tipo === 'OCUPADO') claseColor = "bg-[#1e293b] text-white cursor-not-allowed";
                                if (asiento.tipo === 'PREMIUM') claseColor = "bg-green-100 hover:bg-green-200 border border-green-300 text-green-700";
                                if (esSeleccionado) claseColor = "bg-[#4d7c44] text-white border-[#4d7c44]";

                                return (
                                  <button key={asiento.id} type="button" onClick={() => toggleAsiento(asiento.id, asiento.tipo)} className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${claseColor}`}>
                                    {asiento.id}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-8 text-center text-xs font-black text-slate-300">{fila.numero}</div>
                            <div className="flex gap-2 flex-1 justify-start">
                              {fila.asientos.slice(3,6).map((asiento) => {
                                const esSeleccionado = asientosSeleccionados.includes(asiento.id);
                                let claseColor = "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700";
                                if (asiento.tipo === 'OCUPADO') claseColor = "bg-[#1e293b] text-white cursor-not-allowed";
                                if (asiento.tipo === 'PREMIUM') claseColor = "bg-green-100 hover:bg-green-200 border border-green-300 text-green-700";
                                if (esSeleccionado) claseColor = "bg-[#4d7c44] text-white border-[#4d7c44]";

                                return (
                                  <button key={asiento.id} type="button" onClick={() => toggleAsiento(asiento.id, asiento.tipo)} className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${claseColor}`}>
                                    {asiento.id}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* PASO 2: FORMULARIO DETALLADO DE PASAJEROS */}
                {step === 2 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Datos del Pasajero</h3>

                    {datosPasajeros.map((pasajero, idx) => (
                      <div key={idx} className="space-y-4 pb-6 border-b border-slate-100 last:border-none">
                        <p className="text-xs font-black text-[#4d7c44] uppercase tracking-wider">Viajero {idx + 1} — Asiento Asignado: {asientosSeleccionados[idx] || "N/A"}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-sm text-slate-700">
                          <div className="space-y-1">
                            <label className="text-xs font-bold">Nombre(s)</label>
                            <input type="text" value={pasajero.nombres} onChange={(e) => handleInputChange(idx, 'nombres', e.target.value)} placeholder="Juan" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold">Apellidos</label>
                            <input type="text" value={pasajero.apellidos} onChange={(e) => handleInputChange(idx, 'apellidos', e.target.value)} placeholder="Perez Garcia" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold">Fecha de Nacimiento</label>
                            <input type="date" value={pasajero.fechaNacimiento} onChange={(e) => handleInputChange(idx, 'fechaNacimiento', e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-500" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold">Nacionalidad</label>
                            <input type="text" value={pasajero.nacionalidad} onChange={(e) => handleInputChange(idx, 'nacionalidad', e.target.value)} placeholder="Mexicana" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold">Número de Pasaporte / ID</label>
                            <input type="text" value={pasajero.pasaporte} onChange={(e) => handleInputChange(idx, 'pasaporte', e.target.value)} placeholder="ABC123456" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold">Fecha de Vencimiento</label>
                            <input type="date" value={pasajero.vencimientoPasaporte} onChange={(e) => handleInputChange(idx, 'vencimientoPasaporte', e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-500" required />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold">Correo Electrónico</label>
                            <input type="email" value={pasajero.correo} onChange={(e) => handleInputChange(idx, 'correo', e.target.value)} placeholder="juan@correo.com" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold">Teléfono de Contacto</label>
                            <input type="tel" value={pasajero.telefono} onChange={(e) => handleInputChange(idx, 'telefono', e.target.value)} placeholder="+52 55 1234 5678" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PASO 3: METODO DE PAGO CON ENCRIPTACION */}
                {step === 3 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight flex items-center gap-2">Metodo de Pago</h3>

                    <div className="bg-[#4d7c44]/5 border border-[#4d7c44]/20 p-4 rounded-xl flex items-center gap-3 text-xs font-bold text-[#4d7c44]">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <span>Tu informacion de pago esta protegida con encriptacion de 256 bits</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-sm text-slate-700">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold">Numero de Tarjeta</label>
                        <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold">Nombre en la Tarjeta</label>
                        <input type="text" placeholder="JUAN PEREZ" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold">Fecha de Vencimiento</label>
                        <input type="text" placeholder="MM/AA" maxLength={5} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold">CVV</label>
                        <input type="password" placeholder="123" maxLength={3} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BARRA LATERAL DERECHA: RESUMEN DE COMPRA COMPARTIDO */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <div className="font-bold text-xs text-slate-400 space-y-1 border-b border-slate-100 pb-3">
                  <div className="flex justify-between text-sm font-black text-slate-900 mb-2">
                    <span>Resumen de Viaje</span>
                  </div>
                  {/* MODIFICACIÓN: Inyección de variables dinámicas reales en el bloque de resumen lateral */}
                  <p>🛫 Origen: {origenCodigo}</p>
                  <p>🛬 Destino: {destinoCodigo}</p>
                  <p>📅 Fecha: {fechaMostrar}</p>
                </div>

                <div className="space-y-3 font-bold text-sm text-slate-500">
                  <div className="flex justify-between">
                    <span>Vuelo base ({cantidadPasajeros}x):</span>
                    <span className="text-slate-800">${precioBaseTotal.toLocaleString()} {moneda}</span>
                  </div>
                  {cargosExtra > 0 && (
                    <div className="flex justify-between text-[#4d7c44]">
                      <span>Cargos por Asiento Premium:</span>
                      <span>+ ${cargosExtra.toLocaleString()} MXN</span>
                    </div>
                  )}
                  {asientosSeleccionados.length > 0 && (
                    <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                      <span>Asientos ({asientosSeleccionados.join(', ')}):</span>
                      <span className="font-black text-slate-600">$0 MXN</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end border-t border-slate-100 pt-4 mb-4">
                  <span className="text-base font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-[#4d7c44] tracking-tighter">${precioFinalTotal.toLocaleString()} {moneda}</span>
                </div>

                {/* ACCIONES DE CONTROL */}
                {step === 1 && (
                  <button
                    onClick={() => setStep(2)}
                    disabled={asientosSeleccionados.length !== cantidadPasajeros}
                    className="w-full bg-[#4d7c44] hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    Continuar
                  </button>
                )}

                {step === 2 && (
                  <button
                    onClick={() => setStep(3)}
                    className="w-full bg-[#4d7c44] hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest shadow-md cursor-pointer"
                  >
                    Continuar
                  </button>
                )}

                {step === 3 && (
                  <button
                    onClick={ejecutarSimulacionCompra}
                    disabled={loadingCompra}
                    className="w-full bg-[#4d7c44] hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loadingCompra ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Confirmar y Pagar"}
                  </button>
                )}

                {/* BOTÓN VOLVER (SÓLO DENTRO DEL ASISTENTE) */}
                {step > 1 && (
                  <button
                    onClick={() => setStep(prev => prev - 1)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest cursor-pointer"
                  >
                    Volver
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}