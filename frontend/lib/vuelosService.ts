// URL BASE DEL SERVIDOR
const BASE_URL = "https://seal-app-u4egd.ondigitalocean.app/api";

export const vuelosService = {
  /**
   * 1. AUTOCOMPLETADO (Para los inputs mientras escribes)
   * Brian dice: "es api/external/locations"
   */
  buscarUbicaciones: async (query: string) => {
    try {
      const res = await fetch(`${BASE_URL}/external/locations/?query=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (error) {
      console.error("Error en autocompletado:", error);
      return [];
    }
  },

  /**
   * 2. BÚSQUEDA DE VUELOS (Para el botón naranja de buscar)
   * Brian dice: "/api/vuelos/vuelos va al botón de buscar"
   */
  buscarVuelosReales: async (origen: string, destino: string, fecha: string) => {
    try {
      // Nota cómo cambia la ruta aquí a /vuelos/vuelos/
      const url = `${BASE_URL}/vuelos/vuelos/?origen=${origen}&destino=${destino}&fecha_salida=${fecha}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error en el servidor de vuelos");

      const data = await res.json();
      return data.data || data;
    } catch (error) {
      console.error("Error en búsqueda real:", error);
      return { error: true };
    }
  }
};