// frontend/lib/reservasService.ts
export const reservasService = {
  async crearReserva(payload: {
    vuelo_id: string;
    usuario_id: number;
    cantidad_pasajeros: number;
    asientos: string;
    monto_total: number;
  }) {
    try {
      // IMPORTANTE: Asegúrate de usar la URL absoluta con la diagonal al final de crearreservas/
      const response = await fetch('https://seal-app-u4egd.ondigitalocean.app/crearreservas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error("Error en reservasService:", error);
      return { status: 500, data: { error: "No se pudo conectar con el servidor de NextStop." } };
    }
  }
};