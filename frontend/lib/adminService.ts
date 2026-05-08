// lib/adminService.ts

// Usamos la URL exacta que te pasó Brian
const API_URL = "https://seal-app-u4egd.ondigitalocean.app/api/usuarios/gestionar_usuarios/";

export const adminService = {
  // Obtener la lista real (GET)
  obtenerUsuarios: async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(`Error ${res.status}: No se pudo conectar con el backend`);
      return await res.json();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  },

  // Actualizar roles (PUT)
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

  // Eliminar usuario (DELETE)
  eliminarUsuario: async (usuarioId: number) => {
    try {
      // Pasamos el ID por parámetro de consulta como lo programó Brian
      const res = await fetch(`${API_URL}?usuario_id=${usuarioId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (error) {
      return { error: "No se pudo eliminar el usuario" };
    }
  }
};