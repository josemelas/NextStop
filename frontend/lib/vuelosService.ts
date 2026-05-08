const API_URL = "https://seal-app-u4egd.ondigitalocean.app/apis_externas";

export const vuelosService = {
  // NUEVO: Busca ciudades o aeropuertos para el autocompletado
  buscarUbicaciones: async (query: string) => {
    try {
      const res = await fetch(`${API_URL}/locations/?query=${query}`);
      if (!res.ok) return [];
      return await res.json(); // Devuelve [{nombre, codigo, tipo}, ...]
    } catch (error) {
      console.error("Error buscando ubicaciones:", error);
      return [];
    }
  },

  buscarVuelosReales: async (origen: string, destino: string, fecha: string) => {
    try {
      const url = `${API_URL}/vuelos/?origen=${origen}&destino=${destino}&fecha_salida=${fecha}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      return data.data || data;
    } catch (error) {
      return { error: true };
    }
  }
};