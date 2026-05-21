// frontend/lib/favoritosService.ts

const BASE_URL = 'https://seal-app-u4egd.ondigitalocean.app/api'; // Integrado el /api global

export const favoritosService = {

  // 1. OBTENER LISTA DE FAVORITOS
  async listarFavoritos(usuarioId: number) {
    try {
      const response = await fetch(`${BASE_URL}/favoritos/favoritos/listar/?usuario_id=${usuarioId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al listar favoritos:", error);
      return [];
    }
  },

  // 2. AÑADIR NUEVO FAVORITO
  async agregarFavorito(usuarioId: number, idRecurso: string, tipoRecurso: 'VUELO' | 'PAIS' | 'DESTINO' = 'VUELO') {
    try {
      const response = await fetch(`${BASE_URL}/favoritos/favoritosa/agregar/`, { // Con barra diagonal final obligatoria
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          id_recurso: idRecurso,
          tipo_recurso: tipoRecurso
        })
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      return { status: 500, data: { error: "No se pudo conectar con el servidor de NextStop." } };
    }
  },

  // 3. ELIMINAR DE FAVORITOS
  async eliminarFavorito(usuarioId: number, idRecurso: string, tipoRecurso: string = 'VUELO') {
    try {
      const response = await fetch(`${BASE_URL}/favoritos/favoritos/eliminar/?usuario_id=${usuarioId}&id_recurso=${idRecurso}&tipo_recurso=${tipoRecurso}`, { // Con barra diagonal final obligatoria
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      return { status: 500, data: { error: "No se pudo conectar con el servidor de NextStop." } };
    }
  }
};