// frontend/lib/usuariosService.ts

const BASE_URL = 'https://seal-app-u4egd.ondigitalocean.app/api';

export const usuariosService = {
  async actualizarPerfil(formData: FormData, token: string) {
    try {
      const response = await fetch(`${BASE_URL}/usuarios/editar/`, {
        method: 'PATCH', // Brian lo programó estrictamente como un método PATCH
        headers: {
          // NOTA: Cuando se envía FormData, NO se debe declarar el Content-Type.
          // El navegador añade automáticamente el 'boundary' correcto para archivos.
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error("Error en usuariosService.actualizarPerfil:", error);
      return { status: 500, data: { detail: "No se pudo conectar con el servidor de NextStop." } };
    }
  }
};