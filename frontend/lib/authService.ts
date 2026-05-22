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

  // 2. Inicio de Sesión (Agregamos parámetro portal)
login: async (email: string, pass: string, portal: "cliente" | "empresa") => {
  try {
    const res = await fetch(`${API_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: pass,
        recaptcha_token: "fake-token",
        portal: portal // 👈 Esto es lo que pide Brian
      }),
    });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("user_token", data.token.access);
        localStorage.setItem("user_data", JSON.stringify(data.usuario));
        localStorage.setItem("user_portal", portal); // Guardamos para el Guard
        return { ok: true, data };
      }

      return { ok: false, data: data };
    } catch (error) {
      console.error("Error capturado:", error);
      return { ok: false, data: { error: "Error de conexión: Revisa la URL de la API" } };
    }
  },

  // 3. Validar Token / Verificar Sesión
  verificarSesion: async () => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("user_token");
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/validar-token/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.ok) {
        return await res.json();
      } else {
        localStorage.clear();
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