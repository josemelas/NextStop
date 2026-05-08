const API_URL = "https://seal-app-u4egd.ondigitalocean.app/api/usuarios";

export const authService = {
  // 1. Registro de nuevos clientes
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

  // 2. Inicio de Sesión Real
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
      return { ok: false, data: { error: "Error de red: Verifica tu conexión" } };
    }
  }
};