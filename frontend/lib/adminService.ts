// lib/adminService.ts

const API_URL = "https://seal-app-u4egd.ondigitalocean.app/api/usuarios/gestion-admin/";

export const adminService = {
  // Obtener la lista real de usuarios y sus roles (GET)
  obtenerUsuarios: async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error("Error al obtener usuarios");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Actualizar los roles de un usuario (PUT)
  actualizarRoles: async (usuarioId: number, roles: string[]) => {
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          roles: roles
        })
      });
      return await res.json();
    } catch (error) {
      return { error: "No se pudieron actualizar los roles" };
    }
  },

  // Eliminar un usuario del sistema (DELETE)
  eliminarUsuario: async (usuarioId: number) => {
    try {
      // Pasamos el ID por parámetro de consulta como lo pide el código de Brian
      const res = await fetch(`${API_URL}?usuario_id=${usuarioId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (error) {
      return { error: "No se pudo eliminar el usuario" };
    }
  }
};