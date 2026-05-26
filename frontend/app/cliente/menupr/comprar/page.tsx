"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Calendar, MapPin, Globe, Loader2, ArrowLeft, Users, CreditCard, User, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { SidebarCliente, HeaderUsuario } from '@/app/components/NavCliente';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { reservasService } from '@/lib/reservasService';

// EL AVIÓN AHORA EMPIEZA LIMPIO. SOLO DISPONIBLES Y PREMIUMS.
// LOS OCUPADOS LOS DICTARÁ LA BASE DE DATOS.
const FILAS_AVION = [
  { numero: 1, asientos: [{ id: '1A', tipo: 'PREMIUM' }, { id: '1B', tipo: 'PREMIUM' }, { id: '1C', tipo: 'PREMIUM' }, { id: '1D', tipo: 'PREMIUM' }, { id: '1E', tipo: 'PREMIUM' }, { id: '1F', tipo: 'PREMIUM' }] },
  { numero: 2, asientos: [{ id: '2A', tipo: 'PREMIUM' }, { id: '2B', tipo: 'PREMIUM' }, { id: '2C', tipo: 'PREMIUM' }, { id: '2D', tipo: 'PREMIUM' }, { id: '2E', tipo: 'PREMIUM' }, { id: '2F', tipo: 'PREMIUM' }] },
  { numero: 3, asientos: [{ id: '3A', tipo: 'PREMIUM' }, { id: '3B', tipo: 'PREMIUM' }, { id: '3C', tipo: 'PREMIUM' }, { id: '3D', tipo: 'PREMIUM' }, { id: '3E', tipo: 'PREMIUM' }, { id: '3F', tipo: 'PREMIUM' }] },
  { numero: 4, asientos: [{ id: '4A', tipo: 'DISPONIBLE' }, { id: '4B', tipo: 'DISPONIBLE' }, { id: '4C', tipo: 'DISPONIBLE' }, { id: '4D', tipo: 'DISPONIBLE' }, { id: '4E', tipo: 'DISPONIBLE' }, { id: '4F', tipo: 'DISPONIBLE' }] },
  { numero: 5, asientos: [{ id: '5A', tipo: 'DISPONIBLE' }, { id: '5B', tipo: 'DISPONIBLE' }, { id: '5C', tipo: 'DISPONIBLE' }, { id: '5D', tipo: 'DISPONIBLE' }, { id: '5E', tipo: 'DISPONIBLE' }, { id: '5F', tipo: 'DISPONIBLE' }] },
  { numero: 6, asientos: [{ id: '6A', tipo: 'DISPONIBLE' }, { id: '6B', tipo: 'DISPONIBLE' }, { id: '6C', tipo: 'DISPONIBLE' }, { id: '6D', tipo: 'DISPONIBLE' }, { id: '6E', tipo: 'DISPONIBLE' }, { id: '6F', tipo: 'DISPONIBLE' }] },
  { numero: 7, asientos: [{ id: '7A', tipo: 'DISPONIBLE' }, { id: '7B', tipo: 'DISPONIBLE' }, { id: '7C', tipo: 'DISPONIBLE' }, { id: '7D', tipo: 'DISPONIBLE' }, { id: '7E', tipo: 'DISPONIBLE' }, { id: '7F', tipo: 'DISPONIBLE' }] },
  { numero: 8, asientos: [{ id: '8A', tipo: 'DISPONIBLE' }, { id: '8B', tipo: 'DISPONIBLE' }, { id: '8C', tipo: 'DISPONIBLE' }, { id: '8D', tipo: 'DISPONIBLE' }, { id: '8E', tipo: 'DISPONIBLE' }, { id: '8F', tipo: 'DISPONIBLE' }] },
  { numero: 9, asientos: [{ id: '9A', tipo: 'DISPONIBLE' }, { id: '9B', tipo: 'DISPONIBLE' }, { id: '9C', tipo: 'DISPONIBLE' }, { id: '9D', tipo: 'DISPONIBLE' }, { id: '9E', tipo: 'DISPONIBLE' }, { id: '9F', tipo: 'DISPONIBLE' }] },
];

export default function ReservarVueloWizard() {
  const router = useRouter();
  const [vuelo, setVuelo] = useState<any>(null);
  const [step, setStep] = useState(1);

  const [cantidadPasajeros, setCantidadPasajeros] = useState(1);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);
  const [asientosOcupadosBackend, setAsientosOcupadosBackend] = useState<string[]>([]);
  const [cargosExtra, setCargosExtra] = useState(0);
  const [datosPasajeros, setDatosPasajeros] = useState<any[]>([]);

  // Estados para el formato de Pago
  const [tarjetaNum, setTarjetaNum] = useState("");
  const [tarjetaNombre, setTarjetaNombre] = useState("");
  const [tarjetaVence, setTarjetaVence] = useState("");
  const [tarjetaCvv, setTarjetaCvv] = useState("");

  const [loadingCompra, setLoadingCompra] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);

  const [codigoConfirmacionBackend, setCodigoConfirmacionBackend] = useState("");
  const [errorBackend, setErrorBackend] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const vueloGuardado = localStorage.getItem('vuelo_seleccionado');
    if (vueloGuardado) {
      try {
        const parsedVuelo = JSON.parse(vueloGuardado);
        setVuelo(parsedVuelo);

        // --- FETCH DE ASIENTOS REALES AL BACKEND ---
        const vueloId = parsedVuelo.api_id || parsedVuelo.id;
        if (vueloId) {
          fetch(`https://seal-app-u4egd.ondigitalocean.app/api/vuelos/verificar/${vueloId}/`)
            .then(res => res.json())
            .then(data => {
              if (data.asientos_ocupados) {
                setAsientosOcupadosBackend(data.asientos_ocupados);
              }
            })
            .catch(err => console.error("Error al obtener asientos ocupados:", err));
        }
      } catch (e) {
        console.error("Error al parsear el vuelo:", e);
      }
    }
  }, []);

  useEffect(() => {
    setDatosPasajeros(
      Array.from({ length: cantidadPasajeros }).map(() => ({
        nombres: "", apellidos: "", fechaNacimiento: "", nacionalidad: "Mexicana", tipoIdentificacion: "Credencial para votar INE/IFE", correo: "", telefono: ""
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
  const asientosFaltantes = cantidadPasajeros - asientosSeleccionados.length;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePasajerosChange = (num: number) => {
    setCantidadPasajeros(num);
    setAsientosSeleccionados([]);
    setCargosExtra(0);
  };

  // --- LÓGICA DE CÁLCULO DE EDAD ---
  const calcularEdad = (fechaNac: string) => {
    if (!fechaNac) return 18;
    const fechaActual = new Date();
    const cumple = new Date(fechaNac);
    let edad = fechaActual.getFullYear() - cumple.getFullYear();
    const mes = fechaActual.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleInputChange = (idx: number, campo: string, valor: string) => {
    const nuevosDatos = [...datosPasajeros];
    nuevosDatos[idx][campo] = valor;

    // --- REGLA DE NEGOCIO: IDENTIFICACIÓN PARA MENORES ---
    if (campo === 'fechaNacimiento') {
      const edad = calcularEdad(valor);
      const esMenor = edad < 18;

      if (esMenor) {
        const validasMenor = ["Pasaporte vigente", "Acta de nacimiento", "Credencial escolar"];
        if (!validasMenor.includes(nuevosDatos[idx].tipoIdentificacion)) {
          nuevosDatos[idx].tipoIdentificacion = "Acta de nacimiento";
        }
      } else {
        const validasMayor = ["Credencial para votar INE/IFE", "Pasaporte vigente", "Licencia de conducir vigente", "Cartilla militar", "Acta de nacimiento", "Credencial escolar", "Visa"];
        if (!validasMayor.includes(nuevosDatos[idx].tipoIdentificacion)) {
          nuevosDatos[idx].tipoIdentificacion = "Credencial para votar INE/IFE";
        }
      }
    }

    setDatosPasajeros(nuevosDatos);
    if (errorValidacion) setErrorValidacion("");
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

  const validarPasoPasajeros = () => {
    for (let i = 0; i < datosPasajeros.length; i++) {
      const p = datosPasajeros[i];
      if (!p.nombres.trim() || !p.apellidos.trim() || !p.fechaNacimiento || !p.nacionalidad.trim() || !p.correo.trim() || !p.telefono.trim()) {
        setErrorValidacion(`Por favor, rellena todos los campos obligatorios para el Viajero ${i + 1}.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }
    setErrorValidacion("");
    return true;
  };

  // --- LÓGICA DE FORMATO PARA EL MÉTODO DE PAGO ---
  const handleFormatoTarjeta = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 16) raw = raw.slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1-');
    setTarjetaNum(formatted);
  };

  const handleFormatoVencimiento = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 4) raw = raw.slice(0, 4);
    if (raw.length >= 3) {
      setTarjetaVence(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setTarjetaVence(raw);
    }
  };

  const handleFormatoCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 4) raw = raw.slice(0, 4);
    setTarjetaCvv(raw);
  };

  const ejecutarCompraRealBackend = async () => {
    if (tarjetaNum.length < 19 || tarjetaVence.length < 5 || tarjetaCvv.length < 3 || !tarjetaNombre) {
      setErrorBackend("Por favor completa correctamente los datos de tu tarjeta.");
      return;
    }

    setLoadingCompra(true);
    setErrorBackend("");

    const userDataString = localStorage.getItem("user_data");
    let usuarioIdReal = 1;

    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        if (user && user.id) usuarioIdReal = user.id;
      } catch (e) {
        console.error("Error al leer id de usuario para reserva", e);
      }
    }

    const arrayCorreosPasajeros = datosPasajeros.map(pasajero => ({
      nombre: `${pasajero.nombres} ${pasajero.apellidos}`.trim(),
      correo: pasajero.correo
    }));

    const payloadReserva = {
      vuelo_id: vuelo.api_id || vuelo.id || "API-MOCK-ID",
      usuario_id: usuarioIdReal,
      cantidad_pasajeros: cantidadPasajeros,
      asientos: asientosSeleccionados.join(', '),
      monto_total: precioFinalTotal,
      datos_pasajeros: arrayCorreosPasajeros
    };

    const res = await reservasService.crearReserva(payloadReserva);

    if (res.status === 201) {
      setCodigoConfirmacionBackend(res.data.codigo_confirmation || res.data.codigo_confirmacion);

      const nuevoBoletoHistorial = {
        id_compra: res.data.codigo_confirmacion,
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
      boletosActuales.push(nuevoBoletoHistorial);
      localStorage.setItem('historial_boletos', JSON.stringify(boletosActuales));

      setCompraExitosa(true);
    } else {
      setErrorBackend(res.data.error || "No se pudo completar el cobro de la reserva.");
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
                <p>🔑 <span className="text-slate-900">Código de Confirmación:</span> <span className="font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{codigoConfirmacionBackend}</span></p>
                <p>💵 <span className="text-slate-900">Monto Total Cargado:</span> ${formatCurrency(precioFinalTotal)} {moneda}</p>
              </div>
              <button onClick={() => router.push('/cliente/menupr')} className="w-full bg-slate-900 hover:bg-orange-500 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest cursor-pointer">
                Finalizar y volver al menú principal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">

                {errorValidacion && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm p-5 rounded-3xl flex items-center gap-3 shadow-sm animate-pulse">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p>{errorValidacion}</p>
                  </div>
                )}

                {errorBackend && (
                  <div className="bg-red-50 border border-red-200 text-red-600 font-bold text-sm p-4 rounded-2xl flex items-center gap-2">
                    <span>⚠️ Error: {errorBackend}</span>
                  </div>
                )}

                {/* CARD RESUMEN DEL TRAYECTO */}
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

                {/* PASO 1: MAPA DE ASIENTOS CON ESTADO REAL DE LA BASE DE DATOS */}
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
                      <div className="flex items-end justify-between mb-4">
                        <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Selecciona tu Asiento</h3>
                        {asientosFaltantes > 0 ? (
                          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                            Falta seleccionar {asientosFaltantes} asiento{asientosFaltantes !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-[#4d7c44] bg-[#4d7c44]/10 px-2 py-1 rounded-md border border-[#4d7c44]/20">
                            ¡Asientos completos!
                          </span>
                        )}
                      </div>

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

                            {/* BLOQUE IZQUIERDO */}
                            <div className="flex gap-2 flex-1 justify-end">
                              {fila.asientos.slice(0,3).map((asiento) => {
                                // Combinar estado local estático con estado del servidor
                                const esOcupadoBackend = asientosOcupadosBackend.includes(asiento.id);
                                const tipoReal = esOcupadoBackend ? 'OCUPADO' : asiento.tipo;
                                const esSeleccionado = asientosSeleccionados.includes(asiento.id);

                                let claseColor = "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700";
                                if (tipoReal === 'OCUPADO') claseColor = "bg-[#1e293b] text-white cursor-not-allowed opacity-80";
                                if (tipoReal === 'PREMIUM') claseColor = "bg-green-100 hover:bg-green-200 border border-green-300 text-green-700";
                                if (esSeleccionado) claseColor = "bg-[#4d7c44] text-white border-[#4d7c44]";

                                return (
                                  <button key={asiento.id} type="button" onClick={() => toggleAsiento(asiento.id || '', tipoReal || '')} className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${claseColor}`}>
                                    {asiento.id}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="w-8 text-center text-xs font-black text-slate-300">{fila.numero}</div>

                            {/* BLOQUE DERECHO */}
                            <div className="flex gap-2 flex-1 justify-start">
                              {fila.asientos.slice(3,6).map((asiento) => {
                                // Combinar estado local estático con estado del servidor
                                const esOcupadoBackend = asientosOcupadosBackend.includes(asiento.id);
                                const tipoReal = esOcupadoBackend ? 'OCUPADO' : asiento.tipo;
                                const esSeleccionado = asientosSeleccionados.includes(asiento.id);

                                let claseColor = "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700";
                                if (tipoReal === 'OCUPADO') claseColor = "bg-[#1e293b] text-white cursor-not-allowed opacity-80";
                                if (tipoReal === 'PREMIUM') claseColor = "bg-green-100 hover:bg-green-200 border border-green-300 text-green-700";
                                if (esSeleccionado) claseColor = "bg-[#4d7c44] text-white border-[#4d7c44]";

                                return (
                                  <button key={asiento.id} type="button" onClick={() => toggleAsiento(asiento.id || '', tipoReal || '')} className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${claseColor}`}>
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

                {/* PASO 2: FORMULARIO DETALLADO DE PASAJEROS CON REGLAS DE EDAD */}
                {step === 2 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Datos del Pasajero</h3>

                    {datosPasajeros.map((pasajero, idx) => {
                      const edadPasajero = calcularEdad(pasajero.fechaNacimiento);
                      const esMenorDeEdad = edadPasajero < 18;

                      return (
                        <div key={idx} className="space-y-4 pb-6 border-b border-slate-100 last:border-none">
                          <p className="text-xs font-black text-[#4d7c44] uppercase tracking-wider">Viajero {idx + 1} — Asiento Asignado: {asientosSeleccionados[idx] || "N/A"}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-sm text-slate-700">
                            <div className="space-y-1">
                              <label className="text-xs font-bold">Nombre(s) <span className="text-red-500">*</span></label>
                              <input type="text" value={pasajero.nombres} onChange={(e) => handleInputChange(idx, 'nombres', e.target.value)} placeholder="Nombre del pasajero" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold">Apellidos <span className="text-red-500">*</span></label>
                              <input type="text" value={pasajero.apellidos} onChange={(e) => handleInputChange(idx, 'apellidos', e.target.value)} placeholder="Apellidos del pasajero" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold">Correo Electrónico <span className="text-red-500">*</span></label>
                              <input
                                type="email"
                                value={pasajero.correo}
                                onChange={(e) => {
                                  const val = e.target.value.toLowerCase().replace(/\s/g, '');
                                  handleInputChange(idx, 'correo', val);
                                }}
                                placeholder="mi@correo.com"
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none lowercase"
                                required
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold">Teléfono de Contacto <span className="text-red-500">*</span></label>
                              <div className="flex gap-2">
                                <select className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 outline-none">
                                  <option value="+52">+52 México</option>
                                  <option value="+1">+1 Estados Unidos / Canadá</option>
                                  <option value="+34">+34 España</option>
                                  <option value="+57">+57 Colombia</option>
                                  <option value="+54">+54 Argentina</option>
                                  <option value="+55">+55 Brasil</option>
                                  <option value="+56">+56 Chile</option>
                                  <option value="+51">+51 Perú</option>
                                  <option value="+58">+58 Venezuela</option>
                                </select>
                                <input
                                  type="text"
                                  value={pasajero.telefono}
                                  onChange={(e) => {
                                    let raw = e.target.value.replace(/\D/g, '');
                                    if (raw.length > 10) raw = raw.slice(0, 10);
                                    const formatted = raw.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                                    handleInputChange(idx, 'telefono', formatted);
                                  }}
                                  placeholder="XXX-XXX-XXXX"
                                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                              <input type="date" max={hoy} value={pasajero.fechaNacimiento} onChange={(e) => handleInputChange(idx, 'fechaNacimiento', e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-pointer" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold">Nacionalidad <span className="text-red-500">*</span></label>
                              <select value={pasajero.nacionalidad} onChange={(e) => handleInputChange(idx, 'nacionalidad', e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer text-slate-700 font-semibold" required>
                                <option value="Mexicano(a)">Mexicana</option>
                                <option value="Extranjero(a)">Extranjero</option>
                              </select>
                            </div>

                            {/* IDENTIFICACIÓN DEPENDIENTE DE LA EDAD */}
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold">Tipo de Identificación Oficial <span className="text-red-500">*</span></label>
                              <select value={pasajero.tipoIdentificacion} onChange={(e) => handleInputChange(idx, 'tipoIdentificacion', e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer text-slate-700 font-semibold">
                                {esMenorDeEdad ? (
                                  <>
                                    <option value="Pasaporte vigente">Pasaporte vigente</option>
                                    <option value="Acta de nacimiento">Acta de nacimiento</option>
                                    <option value="Credencial escolar">Credencial escolar</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="Credencial para votar INE/IFE">Credencial para votar INE/IFE</option>
                                    <option value="Pasaporte vigente">Pasaporte vigente</option>
                                    <option value="Licencia de conducir vigente">Licencia de conducir vigente</option>
                                    <option value="Cartilla militar">Cartilla militar</option>
                                    <option value="Acta de nacimiento">Acta de nacimiento</option>
                                    <option value="Credencial escolar">Credencial escolar</option>
                                    <option value="Visa">Visa</option>
                                  </>
                                )}
                              </select>
                              {esMenorDeEdad && pasajero.fechaNacimiento && (
                                <p className="text-[10px] font-bold text-orange-500 mt-1">El pasajero es menor de edad. Solo se aceptan identificaciones vigentes para menores.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PASO 3: METODO DE PAGO CON ENCRIPTACION Y FORMATO */}
                {step === 3 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight flex items-center gap-2">Metodo de Pago</h3>

                    <div className="bg-[#4d7c44]/5 border border-[#4d7c44]/20 p-4 rounded-xl flex items-center gap-3 text-xs font-bold text-[#4d7c44]">
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <span>Tu informacion de pago esta protegida.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-sm text-slate-700">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold">Número de Tarjeta</label>
                        <input
                          type="text"
                          value={tarjetaNum}
                          onChange={handleFormatoTarjeta}
                          placeholder="1234-5678-9012-3456"
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold">Nombre en la Tarjeta</label>
                        <input
                          type="text"
                          value={tarjetaNombre}
                          onChange={(e) => setTarjetaNombre(e.target.value.toUpperCase())}
                          placeholder="NOMBRE DEL PROPIETARIO"
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold">Fecha de Vencimiento</label>
                        <input
                          type="text"
                          value={tarjetaVence}
                          onChange={handleFormatoVencimiento}
                          placeholder="MM/AA"
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold">CVV</label>
                        <input
                          type="password"
                          value={tarjetaCvv}
                          onChange={handleFormatoCvv}
                          placeholder="•••"
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BARRA LATERAL DERECHA: RESUMEN DE COMPRA COMPARTIDO (MÁS LIMPIO) */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <div className="font-bold text-xs text-slate-400 space-y-1 border-b border-slate-100 pb-3">
                  <div className="flex justify-between text-sm font-black text-slate-900 mb-2">
                    <span>Resumen de Viaje</span>
                  </div>
                  <p>🛫 Origen: {origenCodigo}</p>
                  <p>🛬 Destino: {destinoCodigo}</p>
                  <p>📅 Fecha: {fechaMostrar}</p>
                </div>

                <div className="space-y-3 font-bold text-sm text-slate-500">
                  <div className="flex justify-between">
                    <span>Vuelo base ({cantidadPasajeros}x):</span>
                    <span className="text-slate-800">${formatCurrency(precioBaseTotal)} {moneda}</span>
                  </div>
                  {cargosExtra > 0 && (
                    <div className="flex justify-between text-[#4d7c44]">
                      <span>Cargos por Asiento Premium:</span>
                      <span>+ ${formatCurrency(cargosExtra)} MXN</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end border-t border-slate-100 pt-4 mb-4">
                  <span className="text-base font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-[#4d7c44] tracking-tighter">${formatCurrency(precioFinalTotal)} {moneda}</span>
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
                    onClick={() => {
                      if (validarPasoPasajeros()) {
                        setStep(3);
                      }
                    }}
                    className="w-full bg-[#4d7c44] hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest shadow-md cursor-pointer"
                  >
                    Continuar
                  </button>
                )}

                {step === 3 && (
                  <button
                    onClick={ejecutarCompraRealBackend}
                    disabled={loadingCompra}
                    className="w-full bg-[#4d7c44] hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loadingCompra ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Confirmar y Pagar"}
                  </button>
                )}

                {/* BOTÓN VOLVER */}
                {step > 1 && (
                  <button
                    onClick={() => {
                      setStep(prev => prev - 1);
                      setErrorValidacion("");
                    }}
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