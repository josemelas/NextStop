"use client";

import React, { useState } from 'react';
import { Plane, Calendar, DollarSign, Users, Loader2 } from 'lucide-react';

export default function AgregarVuelo({ userInfo, setActiveItem }: { userInfo: any, setActiveItem: (item: string) => void }) {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [salida, setSalida] = useState("");
  const [llegada, setLlegada] = useState("");
  const [precio, setPrecio] = useState("");
  const [asientos, setAsientos] = useState("60");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const payload = {
      id_proveedor: userInfo?.id_proveedor,
      origen: origen.toUpperCase(),
      destino: destino.toUpperCase(),
      fecha_salida: salida.replace("T", " ") + ":00", // Formato esperado por Python datetime
      fecha_llegada: llegada.replace("T", " ") + ":00",
      precio_base: parseFloat(precio),
      asientos_disponibles: parseInt(asientos)
    };

    try {
      const res = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/vuelos/crear/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        alert("¡Vuelo publicado con éxito!");
        setActiveItem('Mis Vuelos'); // Redirigimos automáticamente al catálogo
      } else {
        setMensaje(data.error || "Ocurrió un problema al guardar el vuelo.");
      }
    } catch (err) {
      setMensaje("No se pudo establecer comunicación con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Publicar Nuevo Vuelo</h2>
        <p className="text-slate-500 font-medium mt-1">Completa el formulario para agregar una nueva ruta comercial al catálogo de NextStop.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
        {mensaje && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-bold text-sm">
            ⚠️ {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold text-sm text-slate-700">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Aeropuerto de Origen (IATA)</label>
            <input type="text" value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Ej: MEX" maxLength={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase font-black" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Aeropuerto de Destino (IATA)</label>
            <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ej: MAD" maxLength={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none uppercase font-black" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Fecha y Hora de Salida</label>
            <input type="datetime-local" value={salida} onChange={(e) => setSalida(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-600" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Fecha y Hora de Llegada</label>
            <input type="datetime-local" value={llegada} onChange={(e) => setLlegada(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-600" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Precio Base ($)</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Ej: 12500" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Capacidad Total de Asientos</label>
            <input type="number" value={asientos} onChange={(e) => setAsientos(e.target.value)} placeholder="60" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black" required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#4d7c44] hover:bg-green-700 text-white py-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publicar Vuelo Oficial"}
        </button>
      </form>
    </div>
  );
}