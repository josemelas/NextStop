// Eliminamos /api/usuarios para que coincida con el urls.py de Brian
const API_URL = "https://seal-app-u4egd.ondigitalocean.app";

export const authService = {
  // 1. Registro
  registrar: async (datos: any) => {
    try {
      // La ruta real es https://seal-app-u4egd.ondigitalocean.app/registrar/
      const res = await fetch(`${API_URL}/registrar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, recaptcha_token: "fake-token" }),
      });
      return await res.json();
    } catch (error) {
      return { error: "No se pudo conectar con el servidor de NextStop" };
    }
  },

  // 2. Login
  login: async (email: string, pass: string) => {
    try {
      // La ruta real es https://seal-app-u4egd.ondigitalocean.app/login/
      const res = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: pass,
          recaptcha_token: "fake-token"
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token_access", data.token.access);
        localStorage.setItem("token_refresh", data.token.refresh);
        localStorage.setItem("user_data", JSON.stringify(data.usuario));
        return { ok: true, data };
      }
      return { ok: false, data };
    } catch (error) {
      return { ok: false, data: { error: "Error de red: Verifica tu conexión" } };
    }
  },

  // 3. Validar Token (Vemos que Brian lo tiene como 'validar-token/')
  verificarSesion: async () => {
    const token = localStorage.getItem("token_access");
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/validar-token/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      return res.ok ? await res.json() : null;
    } catch (error) {
      return null;
    }
  }
};