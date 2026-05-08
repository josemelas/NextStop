// URL Base del servidor de Brian
const API_URL = "https://nextstop-app-u9cvd.ondigitalocean.app/api/vuelos";

export const vuelosService = {
  // 1. Esta es para las sugerencias de ciudades (Ubicaciones)
  buscarUbicaciones: async (query: string) => {
    try {
      // Ruta: /api/vuelos/locations/
      const res = await fetch(`${API_URL}/locations/?query=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (error) {
      console.error("Error en autocompletado:", error);
      return [];
    }
  },

  // 2. Esta es para buscar los vuelos reales
  buscarVuelosReales: async (origen: string, destino: string, fecha: string) => {
    try {
      // Ruta: /api/vuelos/vuelos/
      const url = `${API_URL}/vuelos/?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}&fecha_salida=${fecha}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al buscar vuelos");
      const data = await res.json();

      // Retornamos los datos (si vienen en data.data o directo)
      return data.data || data;
    } catch (error) {
      console.error("Error en búsqueda de vuelos:", error);
      return { error: true };
    }
  }
};