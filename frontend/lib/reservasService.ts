// frontend/lib/reservasService.ts
export const reservasService = {

  async crearReserva(payload: {
    vuelo_id: string;
    usuario_id: number;
    cantidad_pasajeros: number;
    asientos: string;
    monto_total: number;
    datos_pasajeros?: any[]; // Agregado para soportar el arreglo de correos
  }) {
    try {
      const response = await fetch('https://seal-app-u4egd.ondigitalocean.app/api/reservas/crear/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error("Error en reservasService.crearReserva:", error);
      return { status: 500, data: { error: "No se pudo conectar con el servidor." } };
    }
  },

  async listarReservas(usuarioId: number) {
    try {
      const response = await fetch(`https://seal-app-u4egd.ondigitalocean.app/api/reservas/listar/?usuario_id=${usuarioId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error("Error en reservasService.listarReservas:", error);
      return { status: 500, data: [] };
    }
  },

  // NUEVA FUNCIÓN: Verificar asientos (Cumpliendo el estándar de ruta limpia)
  async verificarAsientos(vueloId: string) {
    try {
      const response = await fetch(`https://seal-app-u4egd.ondigitalocean.app/api/reservas/verificar/${vueloId}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error("Error en reservasService.verificarAsientos:", error);
      return { status: 500, data: { asientos_ocupados: [] } };
    }
  }
};