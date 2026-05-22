// frontend/lib/adminService.ts

// Dejamos la URL base limpia para poder movernos entre los distintos módulos de admin
const BASE_URL = "https://seal-app-u4egd.ondigitalocean.app/api";

export const adminService = {

  /**
   * 1. OBTENER ESTADÍSTICAS DEL DASHBOARD (GET)
   * (Actualizado para soportar filtros opcionales de mes y año)
   */
  obtenerEstadisticas: async (token: string, mes?: string, anio?: string) => {
    try {
      let url = `${BASE_URL}/usuarios/admin/dashboard/`;

      // Construimos los parámetros de la URL si el usuario seleccionó un filtro
      const params = new URLSearchParams();
      if (mes) params.append('mes', mes);
      if (anio) params.append('anio', anio);
      const queryStr = params.toString();

      if (queryStr) {
        url += `?${queryStr}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return { status: res.status, data: await res.json() };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return { status: 500, data: { detail: "Error de conexión con el servidor" } };
    }
  },

  /**
   * 2. OBTENER LISTA REAL DE USUARIOS (GET)
   */
  obtenerUsuarios: async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/usuarios/admin/gestion/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Error ${res.status}: No autorizado o ruta no encontrada`);
      return await res.json();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  },

  /**
   * 3. ACTUALIZAR ROLES DE UN USUARIO (PUT)
   */
  actualizarRoles: async (usuarioId: number, roles: string[], token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/usuarios/admin/gestion/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_usuario: usuarioId,
          roles: roles
        })
      });
      return await res.json();
    } catch (error) {
      console.error("Error al actualizar roles:", error);
      return { error: "No se pudieron actualizar los roles en el servidor" };
    }
  },

  /**
   * 4. ELIMINAR UN USUARIO DEL SISTEMA (DELETE)
   */
  eliminarUsuario: async (usuarioId: number, token: string) => {
    try {
      // Pasamos el ID por parámetro de consulta como lo programó Brian, incluyendo la barra final obligatoria
      const res = await fetch(`${BASE_URL}/usuarios/admin/gestion/?usuario_id=${usuarioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await res.json();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return { error: "No se pudo eliminar el usuario" };
    }
  }
};