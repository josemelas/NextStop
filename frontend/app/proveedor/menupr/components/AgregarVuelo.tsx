"use client";

import React, { useState } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';

const PAISES_Y_CIUDADES: Record<string, string[]> = {
  "México": ["Ciudad de México (MEX)", "Cancún (CUN)", "Guadalajara (GDL)", "Monterrey (MTY)", "Tijuana (TIJ)"],
  "Estados Unidos": ["Nueva York (JFK)", "Los Ángeles (LAX)", "Miami (MIA)", "Chicago (ORD)", "Las Vegas (LAS)"],
  "Canadá": ["Toronto (YYZ)", "Vancouver (YVR)", "Montreal (YUL)"],
  "Colombia": ["Bogotá (BOG)", "Medellín (MDE)", "Cartagena (CTG)", "Cali (CLO)"],
  "España": ["Madrid (MAD)", "Barcelona (BCN)", "Sevilla (SVQ)", "Valencia (VLC)"],
  "Francia": ["París (CDG)", "Niza (NCE)", "Lyon (LYS)"],
  "Reino Unido": ["Londres (LHR)", "Mánchester (MAN)", "Edimburgo (EDI)"],
  "Alemania": ["Fráncfort (FRA)", "Múnich (MUC)", "Berlín (BER)"],
  "Japón": ["Tokio (HND)", "Osaka (KIX)"],
  "Emiratos Árabes Unidos": ["Dubái (DXB)", "Abu Dabi (AUH)"],
  "Australia": ["Sídney (SYD)", "Melbourne (MEL)"]
};

export default function AgregarVuelo({ userInfo, setActiveItem }: { userInfo: any, setActiveItem: (item: string) => void }) {
  const [paisOrigen, setPaisOrigen] = useState("");
  const [ciudadOrigen, setCiudadOrigen] = useState("");
  const [paisDestino, setPaisDestino] = useState("");
  const [ciudadDestino, setCiudadDestino] = useState("");

  const [salida, setSalida] = useState("");
  const [llegada, setLlegada] = useState("");
  const [precio, setPrecio] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handlePaisOrigenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaisOrigen(e.target.value);
    setCiudadOrigen("");
  };

  const handlePaisDestinoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaisDestino(e.target.value);
    setCiudadDestino("");
  };

  const extraerIATA = (texto: string) => {
    const match = texto.match(/\(([^)]+)\)/);
    return match ? match[1] : texto;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    if (!ciudadOrigen || !ciudadDestino) {
      setMensaje("Por favor, selecciona las ciudades de origen y destino.");
      setLoading(false);
      return;
    }

    const payload = {
      id_proveedor: userInfo?.id_proveedor,
      origen: extraerIATA(ciudadOrigen),
      destino: extraerIATA(ciudadDestino),
      fecha_salida: salida.replace("T", " ") + ":00",
      fecha_llegada: llegada.replace("T", " ") + ":00",
      precio_base: parseFloat(precio),
      asientos_disponibles: 54 // Capacidad por defecto del mapa de asientos
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
        setActiveItem('Mis Vuelos');
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Publicar Nuevo Vuelo</h2>
        <p className="text-slate-500 font-medium mt-1">Selecciona la ruta e ingresa los detalles comerciales de tu oferta.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
        {mensaje && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-bold text-sm">
            ⚠️ {mensaje}
          </div>
        )}

        {/* SECCIÓN DE RUTA */}
        <div className="bg-[#4d7c44]/5 p-6 rounded-[2rem] border border-[#4d7c44]/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold text-sm text-slate-700">
            {/* Origen */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">País de Salida</label>
              <select value={paisOrigen} onChange={handlePaisOrigenChange} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-600 cursor-pointer" required>
                <option value="" disabled>ej. Estados Unidos</option>
                {Object.keys(PAISES_Y_CIUDADES).map(pais => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Ciudad de Salida</label>
              <select value={ciudadOrigen} onChange={(e) => setCiudadOrigen(e.target.value)} disabled={!paisOrigen} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-600 cursor-pointer disabled:opacity-50" required>
                <option value="" disabled>ej. Nueva York</option>
                {paisOrigen && PAISES_Y_CIUDADES[paisOrigen].map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>

            {/* Destino */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">País de Destino</label>
              <select value={paisDestino} onChange={handlePaisDestinoChange} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-600 cursor-pointer" required>
                <option value="" disabled>ej. Francia</option>
                {Object.keys(PAISES_Y_CIUDADES).map(pais => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Ciudad de Destino</label>
              <select value={ciudadDestino} onChange={(e) => setCiudadDestino(e.target.value)} disabled={!paisDestino} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-600 cursor-pointer disabled:opacity-50" required>
                <option value="" disabled>ej. París</option>
                {paisDestino && PAISES_Y_CIUDADES[paisDestino].map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE DETALLES TÉCNICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold text-sm text-slate-700">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Fecha y Hora de Salida</label>
            <input type="datetime-local" value={salida} onChange={(e) => setSalida(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-600 cursor-pointer" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Fecha y Hora de Llegada</label>
            <input type="datetime-local" value={llegada} onChange={(e) => setLlegada(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-600 cursor-pointer" required />
          </div>
        </div>

        {/* PRECIO CENTRADO */}
        <div className="flex justify-center mt-6">
          <div className="space-y-2 w-full md:w-1/2">
            <label className="text-xs font-bold text-slate-800 text-center block uppercase tracking-wider">Precio Base ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="number" min="1" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-center" required />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#4d7c44] hover:bg-green-700 text-white py-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border-none mt-4">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publicar Vuelo Oficial"}
        </button>
      </form>
    </div>
  );
}