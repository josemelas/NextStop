// Definimos la base con el prefijo que Brian nos marcó
const API_URL = "https://seal-app-u4egd.ondigitalocean.app/api/usuarios";

export const authService = {
  // 1. Registro: La URL final será API_URL + /registrar/
  registrar: async (datos: any) => {
    try {
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

  // 2. Login: La URL final será API_URL + /login/
  login: async (email: string, pass: string) => {
    try {
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
      return { ok: false, data: { error: "Error de red" } };
    }
  },

  // 3. Validar Token
  verificarSesion: async () => {
    if (typeof window === "undefined") return null;
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