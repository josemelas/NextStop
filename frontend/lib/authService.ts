const API_URL = "https://seal-app-u4egd.ondigitalocean.app/api/usuarios";

export const authService = {
  // 1. Registro de usuarios
  registrar: async (datos: any) => {
    try {
      const res = await fetch(`${API_URL}/registrar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...datos,
          recaptcha_token: "fake-token"
        }),
      });
      return await res.json();
    } catch (error) {
      return { error: "No se pudo conectar con el servidor de NextStop" };
    }
  },

  // 2. Inicio de Sesión Real (Sin bypass de prueba)
  login: async (email: string, pass: string) => {
    try {
      // Forzamos el uso de la URL absoluta
      const res = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pass,
          recaptcha_token: "fake-token"
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token_access", data.token.access);
        localStorage.setItem("user_data", JSON.stringify(data.usuario));
        return { ok: true, data };
      }

      // Si el servidor responde pero con error (ej: 401 o 500)
      return { ok: false, data: data };
    } catch (error) {
      // Aquí es donde cae el "Error de red"
      console.error("Error capturado:", error);
      return { ok: false, data: { error: "Error de conexión: Revisa la URL de la API" } };
    }
  },

  // 3. Validar Token / Verificar Sesión
  // Brian tiene la ruta 'validar-token/' en su urls.py
  verificarSesion: async () => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token_access");
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/validar-token/`, {
        method: "GET",
        headers: {
          "Authorization": f`Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.ok) {
        return await res.json();
      } else {
        // Si el token expiró, limpiamos el localstorage
        localStorage.removeItem("token_access");
        localStorage.removeItem("user_data");
        return null;
      }
    } catch (error) {
      return null;
    }
  },

  // 4. Cerrar Sesión
  logout: () => {
    localStorage.clear();
    window.location.href = "/cliente/login";
  }
};